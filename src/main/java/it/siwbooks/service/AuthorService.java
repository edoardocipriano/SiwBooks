package it.siwbooks.service;

import it.siwbooks.model.Author;
import it.siwbooks.model.Book;
import it.siwbooks.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuthorService {

    @Autowired
    private AuthorRepository authorRepository;
    
    @Autowired
    private BookService bookService;

    @Transactional(readOnly = true)
    public List<Author> findAll() {
        return authorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Author> findById(Long id) {
        return authorRepository.findById(id);
    }

    @Transactional
    public Author save(Author author) {
        return authorRepository.save(author);
    }

    @Transactional
    public void deleteById(Long id) {
        // Prima trova tutti i libri di questo autore
        List<Book> authorBooks = bookService.findByAuthor(id);
        
        // Cancella tutti i libri dell'autore
        for (Book book : authorBooks) {
            bookService.deleteById(book.getId());
        }
        
        // Poi cancella l'autore
        authorRepository.deleteById(id);
    }
}