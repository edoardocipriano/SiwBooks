package it.siwbooks.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    @Value("${upload.dir}")
    private String uploadDir;

    @Autowired
    private Environment environment;

    @Autowired(required = false)
    private CloudinaryService cloudinaryService;
    
    @PostConstruct
    public void init() {
        try {
            // Create base upload directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created base upload directory: " + uploadPath.toAbsolutePath());
            }
            
            // Create authors directory
            Path authorsPath = Paths.get(uploadDir, "authors");
            if (!Files.exists(authorsPath)) {
                Files.createDirectories(authorsPath);
                System.out.println("Created authors upload directory: " + authorsPath.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directories", e);
        }
    }

    public String saveImage(MultipartFile file, Long bookId) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // Se siamo in produzione (Heroku) e Cloudinary è disponibile, usa Cloudinary
        if (isProductionProfile() && cloudinaryService != null) {
            try {
                String cloudinaryUrl = cloudinaryService.uploadBookImage(file, bookId);
                System.out.println("Saved image to Cloudinary: " + cloudinaryUrl);
                return cloudinaryUrl;
            } catch (IOException e) {
                System.err.println("Failed to upload to Cloudinary, falling back to local storage: " + e.getMessage());
                // Fallback al salvataggio locale
            }
        }
        
        // Salvataggio locale (sviluppo o fallback)
        try {
            Path bookFolder = Paths.get(uploadDir, String.valueOf(bookId));
            if (!Files.exists(bookFolder)) {
                Files.createDirectories(bookFolder);
                System.out.println("Created book directory: " + bookFolder.toAbsolutePath());
            }
            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                originalFilename = "image_" + System.currentTimeMillis() + ".jpg";
            }
            
            Path destination = bookFolder.resolve(originalFilename);
            file.transferTo(destination);
            System.out.println("Saved image locally to: " + destination.toAbsolutePath());
            return originalFilename;
        } catch (IOException e) {
            System.err.println("Error saving image for book " + bookId + ": " + e.getMessage());
            throw e;
        }
    }

    public String saveAuthorPhoto(MultipartFile file, Long authorId) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // Se siamo in produzione (Heroku) e Cloudinary è disponibile, usa Cloudinary
        if (isProductionProfile() && cloudinaryService != null) {
            try {
                String cloudinaryUrl = cloudinaryService.uploadAuthorPhoto(file, authorId);
                System.out.println("Saved author photo to Cloudinary: " + cloudinaryUrl);
                return cloudinaryUrl;
            } catch (IOException e) {
                System.err.println("Failed to upload author photo to Cloudinary, falling back to local storage: " + e.getMessage());
                // Fallback al salvataggio locale
            }
        }
        
        // Salvataggio locale (sviluppo o fallback)
        try {
            Path authorFolder = Paths.get(uploadDir, "authors", String.valueOf(authorId));
            if (!Files.exists(authorFolder)) {
                Files.createDirectories(authorFolder);
                System.out.println("Created author directory: " + authorFolder.toAbsolutePath());
            }
            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                originalFilename = "photo_" + System.currentTimeMillis() + ".jpg";
            }
            
            Path destination = authorFolder.resolve(originalFilename);
            file.transferTo(destination);
            System.out.println("Saved author photo locally to: " + destination.toAbsolutePath());
            return originalFilename;
        } catch (IOException e) {
            System.err.println("Error saving photo for author " + authorId + ": " + e.getMessage());
            throw e;
        }
    }
    
    public String getImagePath(Long bookId, String fileName) {
        // Se il fileName è già un URL completo (Cloudinary), restituiscilo così com'è
        if (fileName != null && (fileName.startsWith("http://") || fileName.startsWith("https://"))) {
            return fileName;
        }
        // Altrimenti restituisci il path locale
        return "/uploads/" + bookId + "/" + fileName;
    }
    
    public String getAuthorPhotoPath(Long authorId, String fileName) {
        // Se il fileName è già un URL completo (Cloudinary), restituiscilo così com'è
        if (fileName != null && (fileName.startsWith("http://") || fileName.startsWith("https://"))) {
            return fileName;
        }
        // Altrimenti restituisci il path locale
        return "/uploads/authors/" + authorId + "/" + fileName;
    }
    
    private boolean isProductionProfile() {
        return environment != null && 
               (environment.acceptsProfiles("heroku") || environment.acceptsProfiles("production"));
    }
}