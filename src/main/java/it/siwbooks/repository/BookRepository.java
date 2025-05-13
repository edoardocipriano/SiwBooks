package it.siwbooks.repository;

import it.siwbooks.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Trova tutti i libri che contengono parte del titolo (case insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Trova tutti i libri scritti da un autore specifico (tramite ID)
    List<Book> findByAuthors_Id(Long authorId);
}