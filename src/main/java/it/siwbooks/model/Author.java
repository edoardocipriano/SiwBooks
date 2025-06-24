package it.siwbooks.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter 
@Setter
@NoArgsConstructor @AllArgsConstructor
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String surname;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate deathDate;
    
    private String nationality;

    private String photoFileName;

    @ManyToMany(mappedBy = "authors")
    private List<Book> books = new ArrayList<>();
}