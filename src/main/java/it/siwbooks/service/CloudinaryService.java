package it.siwbooks.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Profile({"heroku", "production"})
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder, String publicId) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "overwrite", true,
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    public String uploadBookImage(MultipartFile file, Long bookId) throws IOException {
        String publicId = "book_" + bookId + "_" + System.currentTimeMillis();
        return uploadImage(file, "siwbooks/books/" + bookId, publicId);
    }

    public String uploadAuthorPhoto(MultipartFile file, Long authorId) throws IOException {
        String publicId = "author_" + authorId + "_" + System.currentTimeMillis();
        return uploadImage(file, "siwbooks/authors/" + authorId, publicId);
    }

    public boolean deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
            return false;
        }
    }
} 