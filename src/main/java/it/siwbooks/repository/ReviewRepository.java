package it.siwbooks.repository;

import it.siwbooks.model.Review;
import it.siwbooks.model.Book;
import it.siwbooks.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Optional<Review> findByBookAndUser(Book book, User user);
    
    // Metodo più efficiente per verificare l'esistenza di una recensione
    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.book.id = :bookId AND r.user.id = :userId")
    boolean existsByBookIdAndUserId(@Param("bookId") Long bookId, @Param("userId") Long userId);
    
    // Metodo alternativo usando il nome del metodo Spring Data
    boolean existsByBook_IdAndUser_Id(Long bookId, Long userId);
}