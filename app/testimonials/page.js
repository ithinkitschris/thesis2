"use client";

import { useState, useEffect } from "react";
import { getAuthInstance, getDbInstance, signInAnonymous, serverTimestamp } from "../../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Testimonials() {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", comment: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", comment: "" });
  const [deletingId, setDeletingId] = useState(null);

  // Authenticate user on mount
  useEffect(() => {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    
    if (!authInstance || !dbInstance) {
      setError(
        "Firebase is not configured. Please add your Firebase credentials to .env.local file."
      );
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
          setError("Failed to authenticate. Please refresh the page.");
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to testimonials
  useEffect(() => {
    const dbInstance = getDbInstance();
    if (!user || !dbInstance) return;

    const q = query(collection(dbInstance, "testimonials"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const testimonialsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTestimonials(testimonialsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    const dbInstance = getDbInstance();
    if (!user || !dbInstance) {
      setError("Please wait for authentication to complete or check Firebase configuration.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(dbInstance, "testimonials"), {
        userId: user.uid,
        name: formData.name.trim() || "Anonymous",
        comment: formData.comment.trim(),
        timestamp: serverTimestamp(),
      });

      setFormData({ name: "", comment: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setError("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setEditFormData({
      name: testimonial.name || "",
      comment: testimonial.comment || "",
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: "", comment: "" });
    setError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editFormData.comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    const dbInstance = getDbInstance();
    if (!user || !dbInstance || !editingId) {
      setError("Please wait for authentication to complete or check Firebase configuration.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const testimonialRef = doc(dbInstance, "testimonials", editingId);
      await updateDoc(testimonialRef, {
        name: editFormData.name.trim() || "Anonymous",
        comment: editFormData.comment.trim(),
      });

      setEditingId(null);
      setEditFormData({ name: "", comment: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError("Failed to update testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    const dbInstance = getDbInstance();
    if (!user || !dbInstance) {
      setError("Please wait for authentication to complete or check Firebase configuration.");
      return;
    }

    setDeletingId(testimonialId);
    setError(null);

    try {
      const testimonialRef = doc(dbInstance, "testimonials", testimonialId);
      await deleteDoc(testimonialRef);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-black/60 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="w-full bg-white pt-18 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <img 
              alt="LifeOS Logo" 
              src="/lifeosbadlogo.svg" 
              className="h-20 w-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Testimonials List */}
          <div className="mb-12 mt-8">
            <h2 className="text-[32pt] leading-none font-semibold text-black/80 mb-8">
              Testimonials
            </h2>

            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black/50 text-lg">
                  No testimonials yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white/80 rounded-3xl p-10 drop-shadow-lg2 border-1 border-white"
                  >
                    {editingId === testimonial.id ? (
                      // Edit Form
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                          <label htmlFor={`edit-name-${testimonial.id}`} className="block text-sm font-medium text-black/70 mb-2">
                            Name (optional)
                          </label>
                          <input
                            type="text"
                            id={`edit-name-${testimonial.id}`}
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66d6ff] focus:border-transparent text-black"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-comment-${testimonial.id}`} className="block text-sm font-medium text-black/70 mb-2">
                            Your Experience <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id={`edit-comment-${testimonial.id}`}
                            value={editFormData.comment}
                            onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66d6ff] focus:border-transparent text-black resize-none"
                            placeholder="Tell us about your experience with LifeOS beta..."
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-gradient-to-br from-[#66d6ff] to-[#008cff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={submitting}
                            className="px-4 py-2 border border-black/20 text-black/70 font-semibold rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Display Mode
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black/80">
                              {testimonial.name}
                            </h3>
                            {testimonial.timestamp && (
                              <span className="text-sm text-black/40">
                                {formatDate(testimonial.timestamp)}
                              </span>
                            )}
                          </div>
                          {user && testimonial.userId === user.uid && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(testimonial)}
                                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/20 transition-colors cursor-pointer"
                                aria-label="Edit"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 1.5L12.5 3.5L4.5 11.5H2.5V9.5L10.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(testimonial.id)}
                                disabled={deletingId === testimonial.id}
                                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Delete"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 3.5L3.5 11M3.5 3.5L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-black/70 leading-relaxed whitespace-pre-wrap">
                          {testimonial.comment}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Form */}
          <h2 className="text-3xl font-semibold text-black/80 mb-6 mt-40">
            Share Your Experience
          </h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Thank you! Your testimonial has been submitted.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-48 bg-white/80 rounded-3xl px-8 py-4 drop-shadow-lg2 border-1 border-white focus:outline-none focus:ring-2 focus:ring-[#66d6ff] focus:border-transparent text-black"
                placeholder="Your name"
              />
              <button
                type="submit"
                disabled={submitting || !formData.comment.trim()}
                className={`w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-all cursor-pointer disabled:scale-90 disabled:hover:scale-90 flex-shrink-0 ${
                  formData.comment.trim()
                    ? "bg-gradient-to-br from-[#66d6ff] to-[#008cff] hover:opacity-90 drop-shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label="Submit testimonial"
              >
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.25 5L7.5 13.75L3.75 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={6}
              className="w-full bg-white/80 rounded-3xl p-10 drop-shadow-lg2 border-1 border-white focus:outline-none focus:ring-2 focus:ring-[#66d6ff] focus:border-transparent text-black resize-none"
              placeholder="Tell us about your experience with LifeOS beta..."
              required
            />
          </form>
        </div>
      </div>
    </div>
  );
}
