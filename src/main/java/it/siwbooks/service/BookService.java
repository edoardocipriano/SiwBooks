package it.siwbooks.service;

import it.siwbooks.model.Book;
import it.siwbooks.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Transactional
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Transactional
    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }

    // 🔍 Cerca per titolo (parziale, case insensitive)
    @Transactional(readOnly = true)
    public List<Book> searchByTitle(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // 🔍 Trova tutti i libri scritti da un autore specifico
    @Transactional(readOnly = true)
    public List<Book> findByAuthor(Long authorId) {
        return bookRepository.findByAuthors_Id(authorId);
    }
}