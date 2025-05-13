package it.siwbooks.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Entity
@Getter 
@Setter
@NoArgsConstructor @AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Min(1)
    @Max(5)
    private int rating = 5;

    @Lob
    private String text;

    @ManyToOne
    private User user;

    @ManyToOne
    private Book book;
}