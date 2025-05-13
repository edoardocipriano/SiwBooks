package it.siwbooks.repository;

import it.siwbooks.model.Review;
import it.siwbooks.model.Book;
import it.siwbooks.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Optional<Review> findByBookAndUser(Book book, User user);
}