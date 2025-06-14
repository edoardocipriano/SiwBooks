package it.siwbooks.service;

import it.siwbooks.model.Book;
import it.siwbooks.model.Review;
import it.siwbooks.model.User;
import it.siwbooks.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteById(Long id) {
        reviewRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByBookIdAndUserId(Long bookId, Long userId) {
        try {
            System.out.println("Checking if review exists for bookId: " + bookId + " and userId: " + userId);
            
            if (bookId == null || userId == null) {
                System.out.println("BookId or userId is null, returning false");
                return false;
            }
            
            // Usa il metodo del repository per una query più efficiente
            boolean exists = reviewRepository.existsByBookIdAndUserId(bookId, userId);
            System.out.println("Review exists: " + exists);
            return exists;
        } catch (Exception e) {
            System.err.println("Error in existsByBookIdAndUserId: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public Optional<Review> findByBookAndUser(Book book, User user) {
        try {
            if (book == null || user == null) {
                return Optional.empty();
            }
            return reviewRepository.findByBookAndUser(book, user);
        } catch (Exception e) {
            System.err.println("Error in findByBookAndUser: " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }
}