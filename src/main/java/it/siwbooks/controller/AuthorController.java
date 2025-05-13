package it.siwbooks.controller;

import it.siwbooks.model.Author;
import it.siwbooks.service.AuthorService;
import it.siwbooks.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;

import java.io.IOException;

@Controller
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public String listAuthors(Model model) {
        model.addAttribute("authors", authorService.findAll());
        return "authors/list";
    }

    @GetMapping("/{id}")
    public String showAuthor(@PathVariable Long id, Model model) {
        authorService.findById(id).ifPresent(author -> model.addAttribute("author", author));
        return "authors/details";
    }

    @GetMapping("/admin/new")
    public String newAuthorForm(Model model) {
        model.addAttribute("author", new Author());
        return "authors/form";
    }

    @GetMapping("/admin/edit/{id}")
    public String editAuthorForm(@PathVariable Long id, Model model) {
        authorService.findById(id).ifPresent(author -> {
            model.addAttribute("author", author);
            model.addAttribute("isEdit", true);
        });
        return "authors/form";
    }

    @PostMapping("/admin/save")
    public String saveAuthor(@ModelAttribute Author author,
                             @RequestParam("photo") MultipartFile photoFile) {
        // Se è un'operazione di edit e l'immagine non è stata cambiata
        if (author.getId() != null) {
            authorService.findById(author.getId()).ifPresent(existingAuthor -> {
                if (photoFile.isEmpty()) {
                    author.setPhotoFileName(existingAuthor.getPhotoFileName());
                }
            });
        }
        
        final Author savedAuthor = authorService.save(author);

        if (!photoFile.isEmpty()) {
            try {
                String fileName = fileStorageService.saveAuthorPhoto(photoFile, savedAuthor.getId());
                savedAuthor.setPhotoFileName(fileName);
                authorService.save(savedAuthor); // salva di nuovo con file name
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "redirect:/authors";
    }

    @GetMapping("/admin/delete/{id}")
    public String deleteAuthor(@PathVariable Long id) {
        authorService.deleteById(id);
        return "redirect:/authors";
    }
}