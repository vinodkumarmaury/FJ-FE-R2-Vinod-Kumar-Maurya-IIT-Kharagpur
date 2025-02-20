import { useState } from "react";
import { toast } from "react-toastify";
import { submitFeedback } from "../utils/api";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback({ rating, comment });
      toast.success("Feedback submitted. Thank you!");
      setRating(5);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <div className="border p-4 rounded mt-6 max-w-md">
      <h3 className="text-xl mb-2">Rate Your Ride</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2 border p-1 rounded">
            {[1,2,3,4,5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded"
          rows={3}
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
