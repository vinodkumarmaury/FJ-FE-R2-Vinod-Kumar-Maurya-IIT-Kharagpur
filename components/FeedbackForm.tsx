"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitFeedback } from '@/utils/api';
import { toast } from 'react-toastify';

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback({ rating, comment });
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Feedback Form">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-300">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 mt-1 bg-gray-700 rounded-md"
          aria-label="Select Rating"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-300">
          Comments
        </label>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mt-1 bg-gray-700 rounded-md"
          rows={4}
          aria-label="Feedback Comments"
        />
      </div>

      <motion.button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        aria-label="Submit Feedback"
      >
        Submit Feedback
      </motion.button>
    </form>
  );
}
