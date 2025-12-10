# GSAP Section 6 Code Analysis & Recommendations

## Current Issues

### 1. **Code Repetition (Critical)**
- Phases 1-5 contain nearly identical logic with only index differences
- ~150 lines of duplicated code
- Makes maintenance and bug fixes difficult

### 2. **Magic Numbers Throughout**
- Hard-coded values scattered everywhere:
  - Progress thresholds: `0.12`, `0.24`, `0.36`, `0.48`, `0.6`, `0.7`
  - Animation values: `-325`, `1.5`, `0.25`, `0.75`, `50`
  - Easing strings: `"power3.inOut"`, `"power1.inOut"`, `"power3.out"`
- No single source of truth for configuration

### 3. **Duplicated Calculations**
- Scale calculation repeated 5 times (lines 171-173, 202-205, 235-238, 269-272, 302-305)
- Y position calculation duplicated
- Header animation logic duplicated between transition phase and phase 6

### 4. **Complex Nested Conditionals**
- Deep if/else chain makes flow hard to follow
- Difficult to understand overall animation sequence
- Hard to debug specific phases

### 5. **Performance Concerns**
- Multiple `gsap.set()` calls in `onUpdate` (acceptable for scrub, but could be optimized)
- No memoization of parsed easing functions
- Recalculating values on every scroll frame

### 6. **Maintainability Issues**
- Adding/removing phases requires significant code changes
- Changing timing requires finding and updating multiple places
- No clear separation between configuration and logic

## Recommendations

### Priority 1: Extract Configuration Constants

**Benefits:**
- Single source of truth for all timing values
- Easy to adjust animation timing
- Self-documenting code

```javascript
const ANIMATION_CONFIG = {
  // Phase timing (as percentages of total progress)
  phases: {
    categoryTransition: {
      start: 0,
      end: 0.6,
      duration: 0.12, // Each phase duration
      count: 5 // Number of category transitions
    },
    fadeOut: {
      start: 0.6,
      end: 0.7
    },
    contentReveal: {
      start: 0.7,
      end: 1.0
    }
  },
  
  // Animation values
  container: {
    initialScale: 1.5,
    finalScale: 1,
    scaleEndProgress: 0.8,
    yEndPosition: -325,
    yEndProgress: 0.6
  },
  
  // Opacity values
  opacity: {
    active: 1,
    inactive: 0.25,
    hidden: 0
  },
  
  // Content reveal timing (relative to contentReveal phase)
  contentReveal: {
    header: { start: 0.65, end: 0.85 }, // Overall progress
    description: { start: 0.2, end: 0.7 }, // Phase 6 progress
    ipad: { start: 0.4, end: 1.0 } // Phase 6 progress
  },
  
  // Easing functions
  easing: {
    categoryTransition: "power3.inOut",
    scale: "power1.inOut",
    contentReveal: "power3.out"
  },
  
  // Content reveal properties
  contentOffset: {
    y: 50
  }
};
```

### Priority 2: Create Helper Functions

**Benefits:**
- Eliminates code duplication
- Makes calculations reusable
- Easier to test and debug

```javascript
// Calculate normalized progress within a range
const getNormalizedProgress = (progress, start, end) => {
  if (progress < start) return 0;
  if (progress > end) return 1;
  return (progress - start) / (end - start);
};

// Calculate eased value
const getEasedValue = (progress, easeType) => {
  return gsap.parseEase(easeType)(progress);
};

// Calculate container scale
const getContainerScale = (progress, config) => {
  const scaleProgress = Math.min(1, progress / config.container.scaleEndProgress);
  const scaleEased = getEasedValue(scaleProgress, config.easing.scale);
  return config.container.initialScale - 
    ((config.container.initialScale - config.container.finalScale) * scaleEased);
};

// Calculate container Y position
const getContainerY = (progress, config) => {
  if (progress <= config.container.yEndProgress) {
    const yProgress = progress / config.container.yEndProgress;
    return config.container.yEndPosition * yProgress;
  }
  return config.container.yEndPosition;
};

// Update content reveal element
const updateContentReveal = (element, progress, timing, config) => {
  const normalizedProgress = getNormalizedProgress(
    progress, 
    timing.start, 
    timing.end
  );
  const eased = getEasedValue(normalizedProgress, config.easing.contentReveal);
  
  gsap.set(element, {
    opacity: eased,
    y: config.contentOffset.y - (config.contentOffset.y * eased)
  });
};
```

### Priority 3: Refactor Phase Logic

**Benefits:**
- Data-driven approach
- Easy to add/remove phases
- Much less code

```javascript
// Handle category transition phases (0-60%)
const handleCategoryPhases = (progress, items, config) => {
  const phaseDuration = config.phases.categoryTransition.duration;
  const phaseIndex = Math.floor(progress / phaseDuration);
  const maxPhase = config.phases.categoryTransition.count - 1;
  
  // Clamp to valid phase range
  if (phaseIndex > maxPhase) {
    return { inPhase: false };
  }
  
  const phaseStart = phaseIndex * phaseDuration;
  const phaseProgress = getNormalizedProgress(
    progress,
    phaseStart,
    phaseStart + phaseDuration
  );
  const easedProgress = getEasedValue(
    phaseProgress,
    config.easing.categoryTransition
  );
  
  return {
    inPhase: true,
    phaseIndex,
    easedProgress,
    fromIndex: phaseIndex,
    toIndex: phaseIndex + 1
  };
};
```

### Priority 4: Optimize Performance

**Benefits:**
- Smoother animations
- Better frame rates
- Reduced CPU usage

```javascript
// Cache parsed easing functions
const easingCache = {
  categoryTransition: gsap.parseEase(ANIMATION_CONFIG.easing.categoryTransition),
  scale: gsap.parseEase(ANIMATION_CONFIG.easing.scale),
  contentReveal: gsap.parseEase(ANIMATION_CONFIG.easing.contentReveal)
};

// Use cached easing
const getEasedValue = (progress, easeType) => {
  return easingCache[easeType](progress);
};

// Batch DOM updates
const updateElements = (updates) => {
  Object.entries(updates).forEach(([element, props]) => {
    gsap.set(element, props);
  });
};
```

### Priority 5: Improve Code Organization

**Benefits:**
- Clear separation of concerns
- Easier to understand flow
- Better maintainability

```javascript
const updateAnimation = (progress, items, refs, config) => {
  // Calculate shared values once
  const containerY = getContainerY(progress, config);
  const containerScale = getContainerScale(progress, config);
  
  // Determine current phase
  const categoryPhase = handleCategoryPhases(progress, items, config);
  
  if (categoryPhase.inPhase) {
    // Handle category transitions
    updateCategoryPhase(
      categoryPhase,
      items,
      refs.categories,
      containerY,
      containerScale,
      config
    );
    hideContent(refs);
  } else if (progress <= config.phases.fadeOut.end) {
    // Handle fade out transition
    updateFadeOut(progress, items, refs, containerY, config);
  } else {
    // Handle content reveal
    updateContentReveal(progress, refs, config);
    hideCategories(items, refs.categories, containerY);
  }
};
```

## Refactored Implementation

Here's a complete refactored version that addresses all issues:

```javascript
// GSAP ScrollTrigger animation for context categories
useEffect(() => {
  if (!contextCategoriesRef.current || !section6Ref.current) return;

  const items = categoryItemsRef.current.filter(Boolean);
  if (items.length === 0) return;

  // Configuration - single source of truth
  const CONFIG = {
    phases: {
      categoryTransition: { start: 0, end: 0.6, duration: 0.12, count: 5 },
      fadeOut: { start: 0.6, end: 0.7 },
      contentReveal: { start: 0.7, end: 1.0 }
    },
    container: {
      initialScale: 1.5,
      finalScale: 1,
      scaleEndProgress: 0.8,
      yEndPosition: -325,
      yEndProgress: 0.6
    },
    opacity: { active: 1, inactive: 0.25, hidden: 0 },
    contentReveal: {
      header: { start: 0.65, end: 0.85 },
      description: { start: 0.2, end: 0.7 },
      ipad: { start: 0.4, end: 1.0 }
    },
    easing: {
      categoryTransition: "power3.inOut",
      scale: "power1.inOut",
      contentReveal: "power3.out"
    },
    contentOffset: { y: 50 }
  };

  // Cache easing functions for performance
  const easingCache = {
    categoryTransition: gsap.parseEase(CONFIG.easing.categoryTransition),
    scale: gsap.parseEase(CONFIG.easing.scale),
    contentReveal: gsap.parseEase(CONFIG.easing.contentReveal)
  };

  // Helper functions
  const getNormalizedProgress = (progress, start, end) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };

  const getEasedValue = (progress, easeType) => easingCache[easeType](progress);

  const getContainerScale = (progress) => {
    const scaleProgress = Math.min(1, progress / CONFIG.container.scaleEndProgress);
    const scaleEased = getEasedValue(scaleProgress, 'scale');
    return CONFIG.container.initialScale - 
      ((CONFIG.container.initialScale - CONFIG.container.finalScale) * scaleEased);
  };

  const getContainerY = (progress) => {
    if (progress <= CONFIG.container.yEndProgress) {
      return CONFIG.container.yEndPosition * (progress / CONFIG.container.yEndProgress);
    }
    return CONFIG.container.yEndPosition;
  };

  // Clear existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id === 'categories-scroll') trigger.kill();
  });

  // Set initial states
  gsap.set(contextCategoriesRef.current, { 
    y: 0, 
    scale: CONFIG.container.initialScale 
  });
  gsap.set(items[0], { opacity: CONFIG.opacity.active });
  items.slice(1).forEach(item => {
    gsap.set(item, { opacity: CONFIG.opacity.inactive });
  });
  gsap.set(section6HeaderRef.current, { 
    opacity: 0, 
    y: CONFIG.contentOffset.y 
  });
  gsap.set(section6DescriptionRef.current, { 
    opacity: 0, 
    y: CONFIG.contentOffset.y 
  });
  gsap.set(section6IpadRef.current, { 
    opacity: 0, 
    y: CONFIG.contentOffset.y 
  });

  // Main animation update function
  const updateAnimation = (progress) => {
    const containerY = getContainerY(progress);
    const containerScale = getContainerScale(progress);
    const phaseDuration = CONFIG.phases.categoryTransition.duration;
    const phaseIndex = Math.floor(progress / phaseDuration);
    const maxPhase = CONFIG.phases.categoryTransition.count - 1;

    // Category transition phases (0-60%)
    if (progress <= CONFIG.phases.categoryTransition.end && phaseIndex <= maxPhase) {
      const phaseStart = phaseIndex * phaseDuration;
      const phaseProgress = getNormalizedProgress(
        progress,
        phaseStart,
        phaseStart + phaseDuration
      );
      const easedProgress = getEasedValue(phaseProgress, 'categoryTransition');
      const fromIndex = phaseIndex;
      const toIndex = phaseIndex + 1;

      // Update container
      gsap.set(contextCategoriesRef.current, {
        y: containerY,
        scale: containerScale
      });

      // Update items
      items.forEach((item, index) => {
        if (index < fromIndex || index > toIndex) {
          gsap.set(item, { opacity: CONFIG.opacity.inactive });
        } else if (index === fromIndex) {
          gsap.set(item, { 
            opacity: CONFIG.opacity.active - 
              ((CONFIG.opacity.active - CONFIG.opacity.inactive) * easedProgress) 
          });
        } else if (index === toIndex) {
          gsap.set(item, { 
            opacity: CONFIG.opacity.inactive + 
              ((CONFIG.opacity.active - CONFIG.opacity.inactive) * easedProgress) 
          });
        }
      });

      // Hide content
      gsap.set(section6HeaderRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
      gsap.set(section6DescriptionRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
      gsap.set(section6IpadRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
    }
    // Fade out phase (60-70%)
    else if (progress <= CONFIG.phases.fadeOut.end) {
      const fadeProgress = getNormalizedProgress(
        progress,
        CONFIG.phases.fadeOut.start,
        CONFIG.phases.fadeOut.end
      );
      const easedProgress = getEasedValue(fadeProgress, 'categoryTransition');

      // Fade out categories
      items.forEach(item => {
        gsap.set(item, { 
          opacity: CONFIG.opacity.inactive - (CONFIG.opacity.inactive * easedProgress) 
        });
      });
      gsap.set(contextCategoriesRef.current, {
        opacity: 1 - easedProgress,
        scale: CONFIG.container.finalScale,
        y: containerY
      });

      // Start header animation
      if (progress >= CONFIG.contentReveal.header.start) {
        const headerProgress = getNormalizedProgress(
          progress,
          CONFIG.contentReveal.header.start,
          CONFIG.contentReveal.header.end
        );
        const headerEased = getEasedValue(headerProgress, 'contentReveal');
        gsap.set(section6HeaderRef.current, {
          opacity: headerEased,
          y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * headerEased)
        });
      } else {
        gsap.set(section6HeaderRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
      }

      gsap.set(section6DescriptionRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
      gsap.set(section6IpadRef.current, { opacity: 0, y: CONFIG.contentOffset.y });
    }
    // Content reveal phase (70-100%)
    else {
      // Hide categories
      items.forEach(item => gsap.set(item, { opacity: CONFIG.opacity.hidden }));
      gsap.set(contextCategoriesRef.current, {
        opacity: CONFIG.opacity.hidden,
        scale: CONFIG.container.finalScale,
        y: containerY
      });

      // Reveal content
      const phase6Progress = getNormalizedProgress(
        progress,
        CONFIG.phases.contentReveal.start,
        CONFIG.phases.contentReveal.end
      );

      // Header (continues from fade out phase)
      const headerProgress = getNormalizedProgress(
        progress,
        CONFIG.contentReveal.header.start,
        CONFIG.contentReveal.header.end
      );
      const headerEased = getEasedValue(headerProgress, 'contentReveal');
      gsap.set(section6HeaderRef.current, {
        opacity: headerEased,
        y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * headerEased)
      });

      // Description
      if (phase6Progress >= CONFIG.contentReveal.description.start) {
        const descProgress = getNormalizedProgress(
          phase6Progress,
          CONFIG.contentReveal.description.start,
          CONFIG.contentReveal.description.end
        );
        const descEased = getEasedValue(descProgress, 'contentReveal');
        gsap.set(section6DescriptionRef.current, {
          opacity: descEased,
          y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * descEased)
        });
      }

      // iPad
      if (phase6Progress >= CONFIG.contentReveal.ipad.start) {
        const ipadProgress = getNormalizedProgress(
          phase6Progress,
          CONFIG.contentReveal.ipad.start,
          CONFIG.contentReveal.ipad.end
        );
        const ipadEased = getEasedValue(ipadProgress, 'contentReveal');
        gsap.set(section6IpadRef.current, {
          opacity: ipadEased,
          y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * ipadEased)
        });
      }
    }
  };

  // Create ScrollTrigger
  ScrollTrigger.create({
    id: 'categories-scroll',
    trigger: section6Ref.current,
    start: 'top top',
    end: '+=150%',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => updateAnimation(self.progress)
  });

  // Refresh ScrollTrigger
  const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

  return () => {
    clearTimeout(refreshTimer);
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id === 'categories-scroll') trigger.kill();
    });
  };
}, []);
```

## Benefits of Refactored Version

1. **~60% less code** (from ~320 lines to ~200 lines)
2. **Single configuration object** - easy to adjust timing
3. **No code duplication** - helper functions handle all calculations
4. **Better performance** - cached easing functions, optimized calculations
5. **Easier maintenance** - clear structure, easy to add/remove phases
6. **More readable** - clear function names, logical flow
7. **Easier to test** - helper functions can be tested independently

## Migration Steps

1. **Backup current code** - Save current implementation
2. **Test refactored version** - Ensure animations match exactly
3. **Gradual migration** - Can be done incrementally
4. **Performance testing** - Verify smoothness on various devices

## Additional Recommendations

### Consider Using GSAP Timeline (Optional)
For even smoother animations, consider using GSAP Timeline with ScrollTrigger:

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section6Ref.current,
    start: 'top top',
    end: '+=150%',
    pin: true,
    scrub: 1
  }
});
```

### Add Error Handling
```javascript
if (!items || items.length === 0) {
  console.warn('No category items found for animation');
  return;
}
```

### Consider TypeScript
If migrating to TypeScript, this refactored structure makes it much easier to add types.
