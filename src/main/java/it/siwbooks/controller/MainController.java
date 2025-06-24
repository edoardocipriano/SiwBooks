package it.siwbooks.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.siwbooks.model.Book;
import it.siwbooks.model.Author;
import it.siwbooks.service.BookService;
import it.siwbooks.service.AuthorService;

import java.util.List;

@Controller
public class MainController {

    @Autowired
    private BookService bookService;
    
    @Autowired
    private AuthorService authorService;

    @GetMapping("/")
    public String home() {
        return "index"; // templates/index.html
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // templates/login.html
    }
    
    @GetMapping("/search")
    public String search(@RequestParam(value = "query", required = false) String query, Model model) {
        if (query != null && !query.trim().isEmpty()) {
            // Cerca nei libri
            List<Book> books = bookService.searchByTitle(query);
            
            // Cerca negli autori
            List<Author> authors = authorService.searchByName(query);
            
            model.addAttribute("query", query);
            model.addAttribute("books", books);
            model.addAttribute("authors", authors);
            model.addAttribute("totalResults", books.size() + authors.size());
        }
        
        return "search-results"; // templates/search-results.html
    }
    
    @GetMapping("/debug/auth")
    @ResponseBody
    public String debugAuth(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return "Utente non autenticato";
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("Username: ").append(userDetails.getUsername()).append("<br>");
        sb.append("Authorities: ").append(userDetails.getAuthorities()).append("<br>");
        sb.append("Enabled: ").append(userDetails.isEnabled()).append("<br>");
        sb.append("Account non expired: ").append(userDetails.isAccountNonExpired()).append("<br>");
        sb.append("Credentials non expired: ").append(userDetails.isCredentialsNonExpired()).append("<br>");
        sb.append("Account non locked: ").append(userDetails.isAccountNonLocked()).append("<br>");
        
        return sb.toString();
    }
}