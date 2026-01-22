"use client";

import { useState, useEffect, useRef } from "react";
import { getAuthInstance, getDbInstance, signInAnonymous, serverTimestamp } from "../lib/firebase";
import { collection, addDoc, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function RiskTrustMatrix() {
  const [user, setUser] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Generate or retrieve session ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let currentSessionId = localStorage.getItem('riskTrustMatrix_sessionId');
      if (!currentSessionId) {
        currentSessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('riskTrustMatrix_sessionId', currentSessionId);
      }
      setSessionId(currentSessionId);
    }
  }, []);

  // Authenticate user on mount
  useEffect(() => {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();

    if (!authInstance || !dbInstance) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        try {
          await signInAnonymous();
        } catch (err) {
          console.error("Authentication error:", err);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to data points from Firestore
  useEffect(() => {
    const dbInstance = getDbInstance();
    if (!user || !dbInstance) return;

    const q = query(collection(dbInstance, "riskTrustMatrix"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const points = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDataPoints(points);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching data points:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Focus input when it appears
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleMatrixClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Store both screen position (for modal) and relative position (for calculation)
    setInputPosition({
      screenX: e.clientX,
      screenY: e.clientY,
      relativeX: x,
      relativeY: y,
      rectWidth: rect.width,
      rectHeight: rect.height
    });
    setInputValue("");
    setShowInput(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setShowInput(false);
      return;
    }

    const dbInstance = getDbInstance();
    if (!user || !dbInstance || !containerRef.current || !sessionId) {
      setShowInput(false);
      return;
    }

    // Use stored relative coordinates
    const riskPercent = (inputPosition.relativeX / inputPosition.rectWidth) * 100;
    const trustPercent = (inputPosition.relativeY / inputPosition.rectHeight) * 100;

    setSubmitting(true);

    try {
      await addDoc(collection(dbInstance, "riskTrustMatrix"), {
        userId: user.uid,
        sessionId: sessionId,
        label: inputValue.trim(),
        riskPercent: Math.max(0, Math.min(100, riskPercent)),
        trustPercent: Math.max(0, Math.min(100, trustPercent)),
        timestamp: serverTimestamp(),
      });

      setInputValue("");
      setShowInput(false);
    } catch (err) {
      console.error("Error submitting data point:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handlePointClick = (e, point) => {
    e.stopPropagation(); // Prevent matrix click from firing
    setSelectedPoint(point);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPoint || !user) return;

    const dbInstance = getDbInstance();
    if (!dbInstance) return;

    setDeleting(true);

    try {
      await deleteDoc(doc(dbInstance, "riskTrustMatrix", selectedPoint.id));
      setShowDeleteModal(false);
      setSelectedPoint(null);
    } catch (err) {
      console.error("Error deleting data point:", err);
      alert("Failed to delete. You can only delete your own entries.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPoint(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-black/40">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative rounded-4xl p-8 md:p-12" style={{ minHeight: '500px' }}>
        {/* Matrix Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square cursor-crosshair border border-black/0 rounded-2xl overflow-hidden"
          onClick={handleMatrixClick}
        >
          {/* Grid lines */}
          <div className="absolute inset-16">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/80 transform -translate-x-1/2" />
            {/* Horizontal center line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/80 transform -translate-y-1/2" />
          </div>

          {/* Axis Labels */}
          <div className="absolute inset-0 pointer-events-none">

            {/* Risk Low - Left */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="text-xs text-black/90 font-medium text-center leading-tight">Risk</div>
              <div className="text-lg text-black font-semibold text-center leading-tight">Low</div>
            </div>

            {/* Risk High - Right */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="text-xs text-black/90 font-medium text-center leading-tight">Risk</div>
              <div className="text-lg text-black font-semibold text-center leading-tight">High</div>
            </div>

            {/* Trust Low - Top */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-xs text-black/90 font-medium text-center leading-tight">Trust</div>
              <div className="text-lg text-black font-semibold text-center leading-tight">Low</div>
            </div>

            {/* Trust High - Bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="text-xs text-black/90 font-medium text-center leading-tight">Trust</div>
              <div className="text-lg text-black font-semibold text-center leading-tight">High</div>
            </div>
          </div>

          {/* Data Points */}
          {dataPoints.map((point) => {
            const x = (point.riskPercent / 100) * 100;
            const y = (point.trustPercent / 100) * 100;

            return (
              <div
                key={point.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={(e) => handlePointClick(e, point)}
              >
                {/* Dot */}
                <div className="w-3 h-3 bg-black rounded-full shadow-lg border border-black/20 group-hover:scale-125 transition-transform duration-200" />

                {/* Label - appears on hover */}
                <div className="absolute left-1/2 top-4 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
                    {point.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Click instruction */}
        <p className="text-center text-black/80 text-base mt-4">
          Click anywhere on the matrix to add a data point.
        </p>
        <p className="text-center text-black/40 text-sm mt-6">
          All entries are strictly anonymous. <br />Data stored with Firebase with anonymous userIDs for delete capability.
        </p>
      </div>

      {/* Input Modal */}
      {showInput && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={handleCancel}
          style={{
            // Position modal near click location
            alignItems: inputPosition.screenY > window.innerHeight / 2 ? 'flex-start' : 'center',
            paddingTop: inputPosition.screenY > window.innerHeight / 2 ? '20%' : '0',
          }}
        >
          <div
            className="bg-white rounded-4xl p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <label className="block text-black/70 font-medium mb-2">
                Enter label:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border border-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
                placeholder="e.g., banking"
                disabled={submitting}
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-black/60 hover:text-black/80 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black/70 hover:bg-black/80 text-white rounded-2xl transition-colors disabled:opacity-50"
                  disabled={submitting || !inputValue.trim()}
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPoint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-4xl p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-black/80 mb-2">
              Delete Entry
            </h3>
            <p className="text-black/60 mb-1">
              Are you sure you want to delete <span className="font-semibold">"{selectedPoint.label}"</span>?
            </p>
            <p className="text-black/40 text-sm mb-4">
              {selectedPoint.userId === user?.uid
                ? "This action cannot be undone."
                : "Note: You can only delete your own entries."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 text-black/60 hover:text-black/80 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500/70 hover:bg-red-500/80 text-white rounded-2xl transition-colors disabled:opacity-50"
                disabled={deleting || selectedPoint.userId !== user?.uid}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
