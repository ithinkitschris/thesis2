export const articles = [
  {
    slug: "the-21km-mark",
    title: "The 21km Mark",
    excerpt: "A personal reflection on the journey of this thesis of mine at the halfway mark today.",
    date: "2025-12-23",
    readingTime: 5,
    content: `

“Aha! I’m going to design the future of UI, this is it!” This was how I started my thesis back in July of this year, little did I know just how infantile I sound now in hindsight, and what was to come for me.

I had a personal belief, and I still do today: contemporary UI has become too rigid, too templatized, too formulaic. Component frameworks like React Native and SwiftUI have tokenized everything into repeatable patterns. There's little wiggle room left in interface design in this world of rounded rectangles and lazy loading scrolling lists. I wanted to explore how we could bring delight back into digital experiences.

But I also understood why UI had become this way. The average user requires familiarity. Interface design is a means to an end, not something to be superfluously meddled with. I'm an Art Director by profession; admittedly form-over-function in a lot of my instincts as a creative, but I recognize this tension as a rational person, let alone a budding Interaction Designer now. Consistency and familiarity is key. 

Still, I thought there had to be a middle ground. Some way to design interfaces that were both functional and delightful; which naturally led me to hypothesizing multimodal interface designs for the coming future. There was one catch: if I want my speculative multimodal interactions to be anything close to plausible, all arrows pointed towards AI in this future as well. 

I began researching into AI, and the question changed entirely.

---

I grew up a tech person, not even by choice; my mother was a computer scientist, my father a 3D animator. This was in the 1990s, when those careers were thoroughly unusual. My father built me my first computer when I was six years old. What followed next was inevitable: RollerCoaster Tycoon, SimCity 4, Neopets, MapleStory, RuneScape, all the whateverCrafts from Blizzard and their sequels. In my teens and with my polycarbonate Macbook, I even persuaded my parents to buy me a physical copy of OS X Snow Leopard, despite it being just an incremental update. I customized my Mac desktop with CandyBar, set up custom launchers on my Galaxy Nexus. It’s little to no surprise that I find myself where I am today, serendipititously.

When I started this thesis, I assumed the challenge would be aesthetic. How do we make interfaces beautiful again? How do we design experiences that spark joy while maintaining usability?

But as I dug deeper into where AI is taking us, I realized I was asking the wrong question entirely. We’re moving towards a future where there is no UI, that a UI is your own, where AI handles everything proactively, removing the interface completely. This wasn't just about what LLMs can do today. As I researched further into scaling laws, robotics integration, world models, agentic systems, I began to understand the actual trajectory we're on. This isn't five years out. This is happening now, and most people, including myself, haven't truly thought it through.

I realized that oversight and AI safety can't just be a machine learning problem or a policy problem. It has to be addressed at the interaction design level as well. The entire stack matters from data ingestion to model interpretability and safeguards to, crucially, the very design of the products through which users interface with AI systems. This was where I hope to be able to contribute to the current understanding of AI safety. 

Users aren't expected to understand how AI models work on a technical level. Absolutely not. But they can be made aware of risks through how they interact with these systems. I started drawing analogies: Apple's data privacy transparency, discourse around the manipulation and dark patterns around algorithms today. The decisions we make as Interaction Designers carry disproportionate power. It's a massive responsibility.

I believe that with novel, yet-to-be-figured-out design, it's possible to incorporate oversight into powerful agentic AI automation. Think about "delightful friction" today, swipe to confirm a transaction, for example. It adds just a little more heft to the decision a user makes, but it does so in a way that isn't a massive hindrance. 

My personal concern in all of this however; is a misaligned AI that deceives or persuades a user who relies too heavily on it. The AI doesn't necessarily have to be explicitly malicious. It could be entirely benevolent. But if there's misalignment—acting in ways unintended by the user, automation bias and passive loss of control could lead to unwanted outcomes. 

---

Today, I have developed LifeOS: a speculative design research vehicle. 

I had assumed going in that most people would willingly surrender control for the benefits of automation. But early thoughts and reactions from people close to me has surprised me, and that perhaps to my dire fault; I have underestimated the ‘general public’. However, this is literally one of the core areas of inquiry in my thesis, and as I am actively investigating this today, I don't have the answer quite yet.

That uncertainty extends to nearly every aspect of this work, and it's been a  massive difficulty. There is little clarity in what I am trying to do from the perspective of a critic or a third person. A lot of that is on me; I'm actively learning how to articulate a wicked problem in this incredibly nascent field. But I do wonder if some of it is due to the nature of the problem itself. The overall sentiment seems to be that close to everyone is wading in the dark here as well when faced with the sheer capability of AI. Not just what it can do today, but what it could and will scale to do in the very near future.

However, the makes it all the more enticing me to continue to work on, in an almost masochistic way. There has to be a focus on how we may design for agency and oversight in human-AI interaction, the same way we think about data privacy and ethical algorithms today.

---

I’ve been asked frequently what sucess looks to me; a very fair question to one undertaking a master’s thesis. I’d admit, I don’t have the clearest answer at this point, but I were to give one today; it’ll be that people begin to understand to a certain degree of clarity to which I'm pursuing. That designing responsibly for agency and oversight is absolutely crucial and almost mandatory when integrating AI into products that the public uses. If we’d like to live and believe in a better future, that is.

The UI of the future might not have buttons or screens at all. But if there is one thing I’ve learnt as an Interaction Designer thus far? That lack of a UI… is also, absolutely, intentionally, designed.

I'm still figuring out what this all means, and while I find myself at the halfway mark to the submission of this thesis today, I do think I am just at the starting line for something I’d like to work on for a larger part of my life ahead.
    `
  },
  
];

export function getArticleBySlug(slug) {
  return articles.find(article => article.slug === slug);
}

export function getAllArticles() {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}
