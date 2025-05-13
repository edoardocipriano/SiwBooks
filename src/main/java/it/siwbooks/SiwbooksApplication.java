package it.siwbooks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class SiwbooksApplication {

	public static void main(String[] args) {
		SpringApplication.run(SiwbooksApplication.class, args);
	}

}