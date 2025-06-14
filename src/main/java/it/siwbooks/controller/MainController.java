package it.siwbooks.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MainController {

    @GetMapping("/")
    public String home() {
        return "index"; // templates/index.html
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // templates/login.html
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