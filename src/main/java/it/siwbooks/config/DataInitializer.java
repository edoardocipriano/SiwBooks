package it.siwbooks.config;

import it.siwbooks.model.Role;
import it.siwbooks.model.User;
import it.siwbooks.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("=== Inizializzazione dati ===");
        createUserIfNotExists("admin_prova", "admin123", Role.ADMIN);
        createUserIfNotExists("user_prova", "user123", Role.USER);
        System.out.println("=== Fine inizializzazione dati ===");
    }

    @Transactional
    private void createUserIfNotExists(String username, String password, Role role) {
        System.out.println("Verifico esistenza utente: " + username);
        if (userService.findByUsername(username).isEmpty()) {
            System.out.println("Creo nuovo utente: " + username);
            User user = new User();
            user.setUsername(username);
            String encodedPassword = passwordEncoder.encode(password);
            System.out.println("Password codificata: " + encodedPassword);
            user.setPassword(encodedPassword);
            user.setRole(role);
            userService.save(user);
            System.out.println("Utente creato: " + username + " (ruolo: " + role + ")");
        } else {
            System.out.println("Utente già esistente: " + username);
        }
    }
}