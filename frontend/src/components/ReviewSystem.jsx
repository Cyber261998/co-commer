import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc 
} from 'firebase/firestore';

const ReviewSystem = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);

      if (user) {
        const userReview = reviewsData.find(r => r.userId === user.uid);
        if (userReview) {
          setUserReview(userReview);
          setRating(userReview.rating);
          setComment(userReview.comment);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        alert('Please login to submit a review');
        return;
      }

      const reviewData = {
        userId: user.uid,
        productId,
        rating,
        comment,
        userName: user.displayName,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      await loadReviews();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="review-system">
      <h3>Customer Reviews</h3>
      
      {user && !userReview && (
        <form onSubmit={handleSubmitReview}>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={star <= rating ? 'star active' : 'star'}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <span className="user-name">{review.userName}</span>
              <span className="rating">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
              {user && user.uid === review.userId && (
                <button 
                  onClick={() => handleDeleteReview(review.id)}
                  className="delete-review"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="review-comment">{review.comment}</p>
            <span className="review-date">
              {new Date(review.createdAt.toDate()).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem; 