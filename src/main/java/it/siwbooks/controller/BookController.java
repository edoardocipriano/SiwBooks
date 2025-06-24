package it.siwbooks.controller;

import it.siwbooks.model.Book;
import it.siwbooks.model.Image;
import it.siwbooks.model.Author;
import it.siwbooks.model.Review;
import it.siwbooks.repository.ImageRepository;
import it.siwbooks.service.BookService;
import it.siwbooks.service.FileStorageService;
import it.siwbooks.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import it.siwbooks.model.User;
import it.siwbooks.service.UserService;
import it.siwbooks.service.ReviewService;

@Controller
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private AuthorService authorService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    // Visualizza tutti i libri
    @GetMapping
    public String listBooks(Model model) {
        try {
            model.addAttribute("books", bookService.findAll());
            return "books/list";
        } catch (Exception e) {
            System.err.println("Errore in listBooks: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Errore nel recupero dei libri: " + e.getMessage());
            return "books/list";
        }
    }

    // Visualizza dettagli di un singolo libro
    @GetMapping("/{id}")
    @Transactional
    public String showBook(@PathVariable Long id, Model model, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Book> bookOpt = bookService.findById(id);
            if (bookOpt.isPresent()) {
                Book book = bookOpt.get();
                
                // Inizializza esplicitamente le collezioni per evitare LazyInitialization exceptions
                if (book.getReviews() == null) {
                    book.setReviews(new ArrayList<>());
                } else {
                    // Inizializza le collezioni senza accedere ai CLOB
                    List<Review> safeReviews = new ArrayList<>();
                    for (Review review : book.getReviews()) {
                        // Assicurati che tutti i campi necessari siano inizializzati
                        if (review.getTitle() == null) review.setTitle("");
                        if (review.getText() == null) review.setText("");
                        safeReviews.add(review);
                    }
                    book.setReviews(safeReviews);
                }
                
                if (book.getAuthors() == null) {
                    book.setAuthors(new ArrayList<>());
                }
                
                if (book.getImages() == null) {
                    book.setImages(new ArrayList<>());
                }
                
                // Verifica se l'utente corrente ha già recensito questo libro
                boolean userHasReviewed = false;
                if (userDetails != null) {
                    try {
                        Optional<User> userOpt = userService.findByUsername(userDetails.getUsername());
                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            userHasReviewed = reviewService.existsByBookIdAndUserId(book.getId(), user.getId());
                            System.out.println("User " + user.getUsername() + " has reviewed book " + book.getTitle() + ": " + userHasReviewed);
                        }
                    } catch (Exception e) {
                        System.err.println("Error checking if user has reviewed book: " + e.getMessage());
                        // In caso di errore, assumiamo che non abbia recensito per sicurezza
                        userHasReviewed = false;
                    }
                }
                
                // Genera i path corretti per le immagini
                List<String> imagePaths = new ArrayList<>();
                if (book.getImages() != null) {
                    for (Image image : book.getImages()) {
                        String imagePath = fileStorageService.getImagePath(book.getId(), image.getFileName());
                        imagePaths.add(imagePath);
                    }
                }
                
                model.addAttribute("book", book);
                model.addAttribute("imagePaths", imagePaths);
                model.addAttribute("userHasReviewed", Boolean.valueOf(userHasReviewed));
                return "books/details";
            } else {
                System.err.println("Libro con ID " + id + " non trovato");
                model.addAttribute("errorMessage", "Libro non trovato");
                return "redirect:/books";
            }
        } catch (Exception e) {
            System.err.println("Errore in showBook per ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Errore nel recupero del libro: " + e.getMessage());
            return "redirect:/books";
        }
    }

    // Form di inserimento (solo admin)
    @GetMapping("/admin/new")
    public String newBookForm(Model model) {
        try {
            model.addAttribute("book", new Book());
            model.addAttribute("authors", authorService.findAll());
            return "books/form";
        } catch (Exception e) {
            System.err.println("Errore in newBookForm: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Errore nella preparazione del form: " + e.getMessage());
            return "redirect:/books";
        }
    }
    
    // Form di modifica (solo admin)
    @GetMapping("/admin/edit/{id}")
    public String editBookForm(@PathVariable Long id, Model model) {
        try {
            Optional<Book> bookOpt = bookService.findById(id);
            if (bookOpt.isPresent()) {
                Book book = bookOpt.get();
                model.addAttribute("book", book);
                model.addAttribute("authors", authorService.findAll());
                model.addAttribute("isEdit", true);
                
                // Prepara la lista degli ID degli autori per il form
                if (book.getAuthors() != null) {
                    List<Long> selectedAuthorIds = book.getAuthors().stream()
                        .map(Author::getId)
                        .collect(Collectors.toList());
                    model.addAttribute("selectedAuthorIds", selectedAuthorIds);
                }
                
                // Genera i path corretti per le immagini esistenti
                List<String> existingImagePaths = new ArrayList<>();
                if (book.getImages() != null) {
                    for (Image image : book.getImages()) {
                        String imagePath = fileStorageService.getImagePath(book.getId(), image.getFileName());
                        existingImagePaths.add(imagePath);
                    }
                }
                model.addAttribute("existingImagePaths", existingImagePaths);
                
                return "books/form";
            } else {
                model.addAttribute("errorMessage", "Libro non trovato");
                return "redirect:/books";
            }
        } catch (Exception e) {
            System.err.println("Errore in editBookForm per ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Errore nella preparazione del form: " + e.getMessage());
            return "redirect:/books";
        }
    }

    @PostMapping("/admin/save")
    @Transactional
    public String saveBook(@ModelAttribute Book book,
                           @RequestParam(value = "imageFiles", required = false) MultipartFile[] imageFiles,
                           @RequestParam(value = "authorIds", required = false) List<Long> authorIds,
                           RedirectAttributes redirectAttributes) {
        try {                   
            // Se è un'operazione di edit, mantieni le immagini esistenti
            List<Image> existingImages = new ArrayList<>();
            if (book.getId() != null) {
                bookService.findById(book.getId()).ifPresent(existingBook -> {
                    existingImages.addAll(existingBook.getImages());
                });
            }
            
            if (authorIds != null) {
                List<Author> authors = authorIds.stream()
                    .map(id -> authorService.findById(id))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
                book.setAuthors(authors);
            } else {
                book.setAuthors(new ArrayList<>());
            }
            
            // Inizializza le collezioni per evitare problemi di null
            if (book.getReviews() == null) {
                book.setReviews(new ArrayList<>());
            }
            
            if (book.getImages() == null) {
                book.setImages(new ArrayList<>());
            }
            
            final Book savedBook = bookService.save(book); // salva e ottieni l'ID
            
            // Se c'è un ID, imposta le immagini esistenti
            Book updatedBook = savedBook;
            if (savedBook.getId() != null && !existingImages.isEmpty()) {
                updatedBook.setImages(existingImages);
                updatedBook = bookService.save(updatedBook);
            }
            
            final Book finalBook = updatedBook;
            if (imageFiles != null) {
                for (MultipartFile imageFile : imageFiles) {
                    if (!imageFile.isEmpty()) {
                        try {
                            String fileName = fileStorageService.saveImage(imageFile, finalBook.getId());
                            Image image = new Image();
                            image.setFileName(fileName);
                            image.setBook(finalBook);
                            imageRepository.save(image);
                        } catch (IOException e) {
                            System.err.println("Errore nel salvataggio dell'immagine: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }
                }
            }
            
            redirectAttributes.addFlashAttribute("successMessage", "Libro salvato con successo");
            return "redirect:/books";
        } catch (Exception e) {
            System.err.println("Errore in saveBook: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore nel salvataggio del libro: " + e.getMessage());
            return "redirect:/books";
        }
    }     

    // Cancellazione (solo admin)
    @GetMapping("/admin/delete/{id}")
    @Transactional
    public String deleteBook(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            bookService.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Libro eliminato con successo");
            return "redirect:/books";
        } catch (Exception e) {
            System.err.println("Errore nell'eliminazione del libro con ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore nell'eliminazione del libro: " + e.getMessage());
            return "redirect:/books";
        }
    }
}