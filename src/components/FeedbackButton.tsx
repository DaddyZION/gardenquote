"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X, Send, Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configure your email here
const FEEDBACK_EMAIL = "your-email@example.com";

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "general">("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const subject = encodeURIComponent(`GardenQuote Feedback: ${feedbackType}`);
    const body = encodeURIComponent(
      `Feedback Type: ${feedbackType}\n` +
      `Rating: ${rating}/5 stars\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent from GardenQuote App`
    );
    
    window.open(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    
    // Reset and close
    setMessage("");
    setRating(0);
    setFeedbackType("general");
    onClose();
  };

  // For Formspree integration (uncomment and replace YOUR_FORM_ID):
  // const handleSubmitFormspree = async () => {
  //   await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       type: feedbackType,
  //       rating,
  //       message,
  //     }),
  //   });
  //   onClose();
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg animate-in slide-in-from-bottom duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-500" />
            Send Feedback
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              What&apos;s this about?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "bug", label: "🐛 Bug" },
                { value: "feature", label: "💡 Idea" },
                { value: "general", label: "💬 General" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFeedbackType(type.value as typeof feedbackType)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                    feedbackType === type.value
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Rate your experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-2 transition-transform hover:scale-110 touch-manipulation active:scale-95"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Your message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim()}
            size="lg"
            className="w-full"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Feedback
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Opens your email app to send
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Floating feedback button component
export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-slate-700 hover:bg-slate-600 text-slate-300 p-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 touch-manipulation"
        aria-label="Send feedback"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
