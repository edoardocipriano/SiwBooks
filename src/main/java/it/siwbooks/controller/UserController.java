package it.siwbooks.controller;

import it.siwbooks.dto.UserForm;
import it.siwbooks.model.Role;
import it.siwbooks.model.User;
import it.siwbooks.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/user/profile")
    public String userProfile(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        model.addAttribute("user", user);
        return "user/profile";
    }
    
    /**
     * Display the registration form
     */
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("userForm", new UserForm());
        return "user/register";
    }
    
    /**
     * Handle user registration (create a regular user)
     */
    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("userForm") UserForm userForm, 
                              BindingResult bindingResult, 
                              Model model) {
        
        // Check if passwords match
        if (!userForm.getPassword().equals(userForm.getConfirmPassword())) {
            model.addAttribute("errorMessage", "Le password non corrispondono");
            return "user/register";
        }
        
        // Check if username already exists
        if (userService.findByUsername(userForm.getUsername()).isPresent()) {
            model.addAttribute("errorMessage", "Questo username è già in uso");
            return "user/register";
        }
        
        // Create the new user
        User newUser = new User();
        newUser.setUsername(userForm.getUsername());
        newUser.setPassword(passwordEncoder.encode(userForm.getPassword()));
        newUser.setRole(Role.USER); // Always create as regular USER
        
        userService.save(newUser);
        
        return "redirect:/login?registered";
    }
    
    /**
     * Display form for admin to create new admin users
     */
    @GetMapping("/admin/create-admin")
    public String showCreateAdminForm(Model model) {
        model.addAttribute("adminForm", new UserForm());
        return "admin/create-admin";
    }
    
    /**
     * Handle admin creation (only accessible to existing admins)
     */
    @PostMapping("/admin/create-admin")
    public String createAdmin(@Valid @ModelAttribute("adminForm") UserForm adminForm, 
                              BindingResult bindingResult, 
                              Model model) {
        
        // Check if passwords match
        if (!adminForm.getPassword().equals(adminForm.getConfirmPassword())) {
            model.addAttribute("errorMessage", "Le password non corrispondono");
            return "admin/create-admin";
        }
        
        // Check if username already exists
        if (userService.findByUsername(adminForm.getUsername()).isPresent()) {
            model.addAttribute("errorMessage", "Questo username è già in uso");
            return "admin/create-admin";
        }
        
        // Create the new admin
        User newAdmin = new User();
        newAdmin.setUsername(adminForm.getUsername());
        newAdmin.setPassword(passwordEncoder.encode(adminForm.getPassword()));
        newAdmin.setRole(Role.ADMIN); // Create as ADMIN role
        
        userService.save(newAdmin);
        
        // Redirect to admin dashboard or appropriate page after success
        return "redirect:/admin/create-admin?success";
    }

    @GetMapping("/debug/users")
    @ResponseBody
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}