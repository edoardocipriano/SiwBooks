package it.siwbooks.controller;

import it.siwbooks.model.Book;
import it.siwbooks.model.Review;
import it.siwbooks.model.User;
import it.siwbooks.service.BookService;
import it.siwbooks.service.ReviewService;
import it.siwbooks.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;

    // Form per aggiungere una recensione
    @GetMapping("/add/{bookId}")
    @Transactional(readOnly = true)
    public String reviewForm(@PathVariable Long bookId, Model model) {
        try {
            System.out.println("Review form requested for book ID: " + bookId);
            Book book = bookService.findById(bookId).orElse(null);
            if (book == null) {
                System.err.println("Book with ID " + bookId + " not found");
                model.addAttribute("errorMessage", "Libro non trovato");
                return "redirect:/books";
            }
            
            Review review = new Review();
            review.setRating(5); // Default rating
            model.addAttribute("review", review);
            model.addAttribute("bookId", bookId);
            model.addAttribute("bookTitle", book.getTitle());
            model.addAttribute("isEdit", false);
            return "reviews/form";
        } catch (Exception e) {
            System.err.println("Errore in reviewForm: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Errore nel caricamento del form: " + e.getMessage());
            return "redirect:/books";
        }
    }

    // Salva recensione (solo se non già presente per quell'utente/libro)
    @PostMapping("/add/{bookId}")
    @Transactional
    public String saveReview(@ModelAttribute Review review, 
                             @PathVariable Long bookId,
                             @AuthenticationPrincipal UserDetails userDetails,
                             RedirectAttributes redirectAttributes) {
        System.out.println("Inizio salvataggio recensione per libro ID: " + bookId);
        
        if (userDetails == null) {
            System.err.println("UserDetails è null - utente non autenticato");
            redirectAttributes.addFlashAttribute("errorMessage", "Devi effettuare l'accesso per lasciare una recensione");
            return "redirect:/books/" + bookId;
        }
        
        try {
            // Verifica se il libro esiste
            System.out.println("Cercando libro con ID: " + bookId);
            Book book = null;
            try {
                book = bookService.findById(bookId).orElse(null);
                System.out.println("Libro trovato: " + (book != null ? book.getTitle() : "null"));
            } catch (Exception e) {
                System.err.println("Errore durante la ricerca del libro: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore interno durante la ricerca del libro");
                return "redirect:/books";
            }
            
            if (book == null) {
                System.err.println("Libro con ID " + bookId + " non trovato");
                redirectAttributes.addFlashAttribute("errorMessage", "Libro non trovato");
                return "redirect:/books";
            }
            
            // Verifica se l'utente esiste
            User user = null;
            try {
                String username = userDetails.getUsername();
                System.out.println("Cercando utente con username: " + username);
                if (username == null || username.trim().isEmpty()) {
                    System.err.println("Username nullo o vuoto");
                    redirectAttributes.addFlashAttribute("errorMessage", "Errore di autenticazione, riprova");
                    return "redirect:/books/" + bookId;
                }
                
                user = userService.findByUsername(username).orElse(null);
                System.out.println("Utente trovato: " + (user != null ? user.getUsername() : "null"));
            } catch (Exception e) {
                System.err.println("Errore durante la ricerca dell'utente: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore interno durante la ricerca dell'utente");
                return "redirect:/books/" + bookId;
            }
            
            if (user == null) {
                System.err.println("Utente " + userDetails.getUsername() + " non trovato");
                redirectAttributes.addFlashAttribute("errorMessage", "Utente non trovato");
                return "redirect:/books/" + bookId;
            }
            
            // Verifica se l'utente ha già recensito questo libro
            try {
                Long userId = user.getId();
                if (userId == null) {
                    System.err.println("User ID è null");
                    redirectAttributes.addFlashAttribute("errorMessage", "Errore nell'identificazione dell'utente");
                    return "redirect:/books/" + bookId;
                }
                
                System.out.println("Verificando recensioni esistenti per libro ID: " + bookId + " e utente ID: " + userId);
                boolean hasReview = reviewService.existsByBookIdAndUserId(bookId, userId);
                System.out.println("L'utente ha già recensito questo libro? " + hasReview);
                
                if (hasReview) {
                    redirectAttributes.addFlashAttribute("errorMessage", "Hai già recensito questo libro");
                    return "redirect:/books/" + bookId;
                }
            } catch (Exception e) {
                System.err.println("Errore durante la verifica delle recensioni: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore interno durante la verifica delle recensioni esistenti");
                return "redirect:/books/" + bookId;
            }
            
            // Imposta valori predefiniti se necessario
            if (review.getTitle() == null || review.getTitle().trim().isEmpty()) {
                review.setTitle("Recensione per " + book.getTitle());
            }
            
            if (review.getRating() < 1 || review.getRating() > 5) {
                review.setRating(5); // Valore predefinito
            }
            
            if (review.getText() == null) {
                review.setText("");
            }
            
            // Imposta le relazioni e salva
            try {
                System.out.println("Impostando relazioni e salvando recensione");
                System.out.println("Titolo recensione: " + review.getTitle());
                System.out.println("Voto: " + review.getRating());
                System.out.println("Testo: " + (review.getText() != null ? review.getText().substring(0, Math.min(20, review.getText().length())) + "..." : "null"));
                
                review.setBook(book);
                review.setUser(user);
                reviewService.save(review);
                
                System.out.println("Recensione salvata con successo");
                redirectAttributes.addFlashAttribute("successMessage", "Recensione aggiunta con successo");
            } catch (Exception e) {
                System.err.println("Errore durante il salvataggio della recensione: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore durante il salvataggio della recensione: " + e.getMessage());
                return "redirect:/books/" + bookId;
            }
        } catch (Exception e) {
            System.err.println("Errore generico in saveReview: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore interno: " + e.getMessage());
        }

        return "redirect:/books/" + bookId;
    }

    // Form per modificare una recensione (solo per l'utente che l'ha creata)
    @GetMapping("/edit/{reviewId}")
    @Transactional(readOnly = true)
    public String editReviewForm(@PathVariable Long reviewId, 
                              @AuthenticationPrincipal UserDetails userDetails,
                              Model model,
                              RedirectAttributes redirectAttributes) {
        try {
            System.out.println("Edit review form requested for review ID: " + reviewId);
            
            // Verifica utente autenticato
            if (userDetails == null) {
                System.err.println("UserDetails è null - utente non autenticato");
                redirectAttributes.addFlashAttribute("errorMessage", "Devi effettuare l'accesso per modificare una recensione");
                return "redirect:/books";
            }
            
            // Verifica se l'utente esiste
            User user = null;
            try {
                String username = userDetails.getUsername();
                System.out.println("Cercando utente con username: " + username);
                if (username == null || username.trim().isEmpty()) {
                    System.err.println("Username nullo o vuoto");
                    redirectAttributes.addFlashAttribute("errorMessage", "Errore di autenticazione, riprova");
                    return "redirect:/books";
                }
                
                user = userService.findByUsername(username).orElse(null);
                System.out.println("Utente trovato: " + (user != null ? user.getUsername() : "null"));
                
                if (user == null) {
                    System.err.println("Utente " + userDetails.getUsername() + " non trovato");
                    redirectAttributes.addFlashAttribute("errorMessage", "Utente non trovato");
                    return "redirect:/books";
                }
            } catch (Exception e) {
                System.err.println("Errore durante la ricerca dell'utente: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore interno durante la ricerca dell'utente");
                return "redirect:/books";
            }
            
            // Recupera la recensione
            Review review = reviewService.findById(reviewId).orElse(null);
            if (review == null) {
                System.err.println("Recensione con ID " + reviewId + " non trovata");
                redirectAttributes.addFlashAttribute("errorMessage", "Recensione non trovata");
                return "redirect:/books";
            }
            
            // Verifica che la recensione appartenga all'utente corrente
            if (review.getUser() == null || !review.getUser().getId().equals(user.getId())) {
                System.err.println("L'utente non è il proprietario della recensione");
                redirectAttributes.addFlashAttribute("errorMessage", "Non sei autorizzato a modificare questa recensione");
                
                // Reindirizza alla pagina del libro della recensione
                if (review.getBook() != null) {
                    return "redirect:/books/" + review.getBook().getId();
                }
                return "redirect:/books";
            }
            
            // Carica il form di modifica
            model.addAttribute("review", review);
            model.addAttribute("isEdit", true);
            if (review.getBook() != null) {
                model.addAttribute("bookId", review.getBook().getId());
                model.addAttribute("bookTitle", review.getBook().getTitle());
            }
            
            return "reviews/form";
            
        } catch (Exception e) {
            System.err.println("Errore in editReviewForm: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore nel caricamento del form: " + e.getMessage());
            return "redirect:/books";
        }
    }
    
    // Aggiorna recensione esistente (solo per l'utente che l'ha creata)
    @PostMapping("/update/{reviewId}")
    @Transactional
    public String updateReview(@PathVariable Long reviewId,
                              @ModelAttribute Review reviewData,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {
        System.out.println("Aggiornamento recensione con ID: " + reviewId);
        
        if (userDetails == null) {
            System.err.println("UserDetails è null - utente non autenticato");
            redirectAttributes.addFlashAttribute("errorMessage", "Devi effettuare l'accesso per modificare una recensione");
            return "redirect:/books";
        }
        
        try {
            // Verifica se l'utente esiste
            User user = null;
            try {
                user = userService.findByUsername(userDetails.getUsername()).orElse(null);
                if (user == null) {
                    System.err.println("Utente " + userDetails.getUsername() + " non trovato");
                    redirectAttributes.addFlashAttribute("errorMessage", "Utente non trovato");
                    return "redirect:/books";
                }
            } catch (Exception e) {
                System.err.println("Errore durante la ricerca dell'utente: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("errorMessage", "Errore interno durante la ricerca dell'utente");
                return "redirect:/books";
            }
            
            // Recupera la recensione esistente
            Review existingReview = reviewService.findById(reviewId).orElse(null);
            if (existingReview == null) {
                System.err.println("Recensione con ID " + reviewId + " non trovata");
                redirectAttributes.addFlashAttribute("errorMessage", "Recensione non trovata");
                return "redirect:/books";
            }
            
            // Verifica che la recensione appartenga all'utente corrente
            if (existingReview.getUser() == null || !existingReview.getUser().getId().equals(user.getId())) {
                System.err.println("L'utente non è il proprietario della recensione");
                redirectAttributes.addFlashAttribute("errorMessage", "Non sei autorizzato a modificare questa recensione");
                
                // Reindirizza alla pagina del libro della recensione
                if (existingReview.getBook() != null) {
                    return "redirect:/books/" + existingReview.getBook().getId();
                }
                return "redirect:/books";
            }
            
            Long bookId = existingReview.getBook() != null ? existingReview.getBook().getId() : null;
            
            // Aggiorna i campi modificabili
            existingReview.setTitle(reviewData.getTitle());
            existingReview.setText(reviewData.getText());
            existingReview.setRating(reviewData.getRating());
            
            // Valida e imposta valori predefiniti
            if (existingReview.getTitle() == null || existingReview.getTitle().trim().isEmpty()) {
                existingReview.setTitle("Recensione per " + 
                    (existingReview.getBook() != null ? existingReview.getBook().getTitle() : "libro"));
            }
            
            if (existingReview.getRating() < 1 || existingReview.getRating() > 5) {
                existingReview.setRating(5);
            }
            
            if (existingReview.getText() == null) {
                existingReview.setText("");
            }
            
            // Salva le modifiche
            reviewService.save(existingReview);
            System.out.println("Recensione aggiornata con successo");
            redirectAttributes.addFlashAttribute("successMessage", "Recensione aggiornata con successo");
            
            // Reindirizza alla pagina del libro
            if (bookId != null) {
                return "redirect:/books/" + bookId;
            }
            return "redirect:/books";
            
        } catch (Exception e) {
            System.err.println("Errore nell'aggiornamento della recensione: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore nell'aggiornamento della recensione: " + e.getMessage());
            return "redirect:/books";
        }
    }

    // Cancellazione (solo admin)
    @GetMapping("/admin/delete/{id}")
    @Transactional
    public String deleteReview(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            // Prima ottieni la recensione per poter reindirizzare al libro corretto
            Long bookId = null;
            try {
                Review review = reviewService.findById(id).orElse(null);
                if (review != null && review.getBook() != null) {
                    bookId = review.getBook().getId();
                }
            } catch (Exception e) {
                System.err.println("Errore nel recupero della recensione: " + e.getMessage());
            }
            
            reviewService.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Recensione eliminata con successo");
            
            // Se abbiamo l'ID del libro, reindirizza alla pagina del libro
            if (bookId != null) {
                return "redirect:/books/" + bookId;
            }
        } catch (Exception e) {
            System.err.println("Errore nell'eliminazione della recensione con ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Errore nell'eliminazione della recensione: " + e.getMessage());
        }
        return "redirect:/books";
    }
}