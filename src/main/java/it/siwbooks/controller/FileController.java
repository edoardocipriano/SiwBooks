package it.siwbooks.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class FileController {

    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping("/uploads/{bookId}/{fileName:.+}")
    public ResponseEntity<Resource> serveBookImage(@PathVariable String bookId, @PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(bookId).resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                MediaType mediaType = MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream");
                
                return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/uploads/authors/{authorId}/{fileName:.+}")
    public ResponseEntity<Resource> serveAuthorPhoto(@PathVariable String authorId, @PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve("authors").resolve(authorId).resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                MediaType mediaType = MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream");
                
                return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 