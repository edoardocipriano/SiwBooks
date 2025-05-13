# SiwBooks - Sistema di Gestione Libreria Online

## Panoramica del Progetto

SiwBooks è un'applicazione web per la gestione di una libreria online, sviluppata come progetto per il corso di Sistemi Informativi su Web. L'applicazione permette agli utenti di sfogliare libri, scoprire autori, leggere e scrivere recensioni, e gestire il proprio profilo.

## Tecnologie Utilizzate

- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Frontend**: Thymeleaf, HTML5, CSS3, JavaScript
- **Database**: H2 Database (per sviluppo), PostgreSQL (per produzione)
- **Build Tool**: Maven

## Struttura del Progetto

Il progetto è organizzato secondo il pattern MVC (Model-View-Controller):

```
siwbooks/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── it/
│   │   │       └── uniroma3/
│   │   │           └── siw/
│   │   │               ├── controller/     # Controller per gestire le richieste HTTP
│   │   │               ├── model/          # Entità JPA
│   │   │               ├── repository/     # Repository per l'accesso ai dati
│   │   │               ├── service/        # Servizi per la logica di business
│   │   │               └── SiwBooksApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── css/              # File CSS per lo stile
│   │       │   │   ├── animations.css   # Animazioni
│   │       │   │   ├── forms.css        # Stili per i form
│   │       │   │   ├── reviews.css      # Stili per le recensioni
│   │       │   │   ├── search.css       # Stili per la ricerca
│   │       │   │   ├── styles.css       # Stili generali
│   │       │   │   └── theme.css        # Gestione tema chiaro/scuro
│   │       │   │
│   │       │   ├── js/               # File JavaScript per l'interattività
│   │       │   │   ├── animations.js    # Gestione animazioni
│   │       │   │   ├── authors.js       # Funzionalità per gli autori
│   │       │   │   ├── books.js         # Funzionalità per i libri
│   │       │   │   ├── main.js          # Funzionalità generali
│   │       │   │   ├── reviews.js       # Funzionalità per le recensioni
│   │       │   │   ├── search.js        # Funzionalità di ricerca
│   │       │   │   └── theme.js         # Gestione tema chiaro/scuro
│   │       │   │
│   │       │   └── uploads/          # Directory per i file caricati
│   │       │
│   │       ├── templates/
│   │       │   ├── fragments/        # Frammenti Thymeleaf riutilizzabili
│   │       │   │   ├── footer.html      # Footer del sito
│   │       │   │   ├── header.html      # Header/navbar del sito
│   │       │   │   └── imports.html     # Import CSS/JS
│   │       │   │
│   │       │   ├── admin/            # Pagine per l'amministratore
│   │       │   ├── authors/          # Pagine per gli autori
│   │       │   ├── books/            # Pagine per i libri
│   │       │   ├── reviews/          # Pagine per le recensioni
│   │       │   ├── user/             # Pagine per l'utente
│   │       │   │
│   │       │   ├── error.html        # Pagina di errore
│   │       │   ├── index.html        # Pagina principale
│   │       │   └── login.html        # Pagina di login
│   │       │
│   │       └── application.properties # Configurazione dell'applicazione
│   │
│   └── test/                      # Test dell'applicazione
└── pom.xml                        # Configurazione Maven
```

## Dettaglio delle Classi e dei File

Di seguito è riportata una descrizione dettagliata di tutte le classi e i file presenti nella cartella `src`:

### Package `it.siwbooks`

#### `SiwbooksApplication.java`
Classe principale che avvia l'applicazione Spring Boot. È annotata con `@SpringBootApplication` e `@EnableTransactionManagement` per abilitare la gestione delle transazioni.

### Package `it.siwbooks.model`

#### `Book.java`
Entità JPA che rappresenta un libro nel sistema.
- Attributi: `id`, `title`, `publicationYear`
- Relazioni:
  - `@OneToMany` con `Image` (cascade)
  - `@ManyToMany` con `Author`
  - `@OneToMany` con `Review` (cascade remove)

#### `Author.java`
Entità JPA che rappresenta un autore nel sistema.
- Contiene informazioni anagrafiche e biografia
- Relazione bidirezionale many-to-many con `Book`

#### `User.java`
Entità JPA che rappresenta un utente del sistema.
- Attributi: `id`, `username`, `password`, `role`
- Relazione `@OneToMany` con `Review`
- Utilizza `@Table(name = "users")` per evitare conflitti con parole riservate SQL

#### `Review.java`
Entità JPA che rappresenta una recensione scritta da un utente per un libro.
- Relazione many-to-one con `Book` e `User`
- Include valutazione a stelle e testo della recensione

#### `Image.java`
Entità JPA che rappresenta un'immagine associata a un libro.
- Memorizza il percorso dell'immagine nel filesystem
- Relazione many-to-one con `Book`

#### `Role.java`
Enumerazione che definisce i ruoli degli utenti: `USER` e `ADMIN`.

### Package `it.siwbooks.controller`

#### `MainController.java`
Controller che gestisce la navigazione principale del sito (homepage e pagine generali).

#### `BookController.java`
Controller per la gestione dei libri:
- Visualizzazione elenco libri
- Dettaglio singolo libro
- Aggiunta, modifica ed eliminazione di libri (solo admin)
- Ricerca avanzata di libri

#### `AuthorController.java`
Controller per la gestione degli autori:
- Visualizzazione elenco e dettaglio autori
- Operazioni CRUD per gli autori (solo admin)
- Associazione/dissociazione libri e autori

#### `ReviewController.java`
Controller per la gestione delle recensioni:
- Visualizzazione recensioni per libro
- Creazione nuove recensioni
- Moderazione recensioni (solo admin)
- Valutazione dell'utilità delle recensioni

#### `UserController.java`
Controller per la gestione degli utenti:
- Registrazione e login
- Gestione profilo personale
- Visualizzazione delle proprie recensioni

### Package `it.siwbooks.repository`

#### `BookRepository.java`
Repository JPA per l'entità `Book` con metodi per:
- Ricerca di libri per titolo, anno, autore
- Ordinamento dei risultati
- Query complesse per la ricerca avanzata

#### `AuthorRepository.java`
Repository JPA per l'entità `Author` che fornisce metodi di ricerca specializzati.

#### `UserRepository.java`
Repository JPA per l'entità `User` con metodi per trovare utenti per username.

#### `ReviewRepository.java`
Repository JPA per l'entità `Review` con metodi per:
- Trovare recensioni per libro o utente
- Conteggio e statistiche sulle recensioni

#### `ImageRepository.java`
Repository JPA per l'entità `Image` che gestisce l'associazione tra immagini e libri.

### Package `it.siwbooks.service`

#### `BookService.java`
Service per la logica di business relativa ai libri:
- Implementa operazioni CRUD
- Gestisce la ricerca avanzata
- Si occupa delle associazioni con autori

#### `AuthorService.java`
Service per la gestione degli autori:
- Implementa operazioni CRUD per gli autori
- Gestisce l'associazione con i libri
- Elabora i dati per la presentazione

#### `ReviewService.java`
Service per la gestione delle recensioni:
- Creazione e modifica recensioni
- Calcolo di statistiche (valutazione media, ecc.)
- Implementa la logica di valutazione dell'utilità delle recensioni

#### `UserService.java`
Service per la gestione degli utenti:
- Registrazione utenti con password criptate
- Gestione del profilo utente
- Integrazione con Spring Security

#### `FileStorageService.java`
Service per la gestione del caricamento e salvataggio di file:
- Gestisce il caricamento di immagini per libri e autori
- Genera nomi file univoci
- Implementa controlli di sicurezza sui file caricati

### Package `it.siwbooks.security`

#### `WebSecurityConfig.java`
Configurazione di Spring Security:
- Definisce le regole di accesso alle risorse
- Configura l'autenticazione form-based
- Imposta la pagina di login personalizzata
- Configura il bean `BCryptPasswordEncoder` per la crittografia delle password

#### `CustomUserDetailsService.java`
Implementazione di `UserDetailsService` per l'autenticazione degli utenti:
- Carica i dati utente dal database
- Costruisce l'oggetto `UserDetails` con ruoli e permessi
- Gestisce la verifica delle credenziali

### Package `it.siwbooks.config`

#### `DatabaseConfig.java`
Configurazione del database dell'applicazione:
- Imposta la connessione al database (H2 o PostgreSQL)
- Configura le proprietà JPA/Hibernate
- Gestisce le impostazioni di pooling di connessione

#### `DataInitializer.java`
Inizializzatore di dati di esempio per l'applicazione:
- Crea utenti predefiniti (admin e user di test)
- Inserisce libri e autori di esempio
- Genera recensioni di prova

### Package `it.siwbooks.dto`

#### `UserForm.java`
Data Transfer Object per la registrazione e gestione degli utenti:
- Contiene campi per username, password e conferma password
- Utilizzato nei form di registrazione e modifica utente

### File di Configurazione

#### `application.properties`
File di configurazione principale dell'applicazione:
- **Datasource**: Configurazione della connessione al database PostgreSQL
- **JPA & Hibernate**: Impostazioni per la generazione automatica dello schema e logging SQL
- **Thymeleaf**: Configurazione del motore di template
- **Upload Immagini**: Percorso per il salvataggio delle immagini caricate
- **Risorse Statiche**: Configurazione delle locations per i file statici
- **Security**: Credenziali predefinite per l'utente admin
- **Server**: Configurazione della porta e gestione degli errori

### Package `it.siwbooks.test`

Contiene i test unitari e di integrazione per le varie componenti dell'applicazione, organizzati secondo i pacchetti principali del progetto (controller, service, repository).

## Caratteristiche Principali

### 1. Interfaccia Utente Moderna e Responsive

- **Design Reattivo**: L'applicazione si adatta a diverse dimensioni di schermo (desktop, tablet, mobile)
- **Tema Chiaro/Scuro**: Possibilità di cambiare tra tema chiaro e scuro, con salvataggio della preferenza
- **Animazioni**: Transizioni fluide e animazioni per migliorare l'esperienza utente
- **Interfaccia Intuitiva**: Navigazione semplice e chiara

### 2. Gestione Libri

- Visualizzazione di tutti i libri disponibili
- Dettaglio libro con informazioni complete
- Ricerca avanzata con filtri per titolo, autore, genere, ecc.
- Suggerimenti di ricerca in tempo reale

### 3. Gestione Autori

- Elenco di tutti gli autori con biografia
- Pagina di dettaglio autore con elenco delle opere
- Ordinamento e filtri per visualizzare gli autori

### 4. Sistema di Recensioni

- Lettura delle recensioni dei libri
- Possibilità di scrivere nuove recensioni con valutazione a stelle
- Segnalazione recensioni utili
- Filtro recensioni per valutazione

### 5. Profilo Utente

- Registrazione e login utenti
- Gestione del profilo personale
- Cronologia delle recensioni scritte
- Lista libri preferiti

### 6. Pannello Amministratore

- Gestione di libri e autori (aggiunta, modifica, eliminazione)
- Moderazione delle recensioni
- Gestione degli utenti

## Dettaglio dei File nel Progetto

### File CSS

#### `styles.css` (734 linee)
Contiene gli stili generali dell'applicazione, definendo l'aspetto base di tutti gli elementi dell'interfaccia. Include:
- Reset CSS moderno
- Definizione delle variabili CSS per colori, spaziature e stili di base
- Stili per header e barra di navigazione
- Stili per i titoli (h1, h2, h3, ecc.)
- Stili per liste e componenti comuni
- Stili per link e immagini
- Stili per card di libri e autori
- Stili per recensioni
- Media queries per responsive design
- Stili per messaggi di errore e successo
- Stili per i form base
- Stili per componenti di amministrazione
- Effetti di ripple per i pulsanti
- Stili per miniature di immagini
- Stili per elenchi di libri e autori
- Stili per il carosello di libri
- Stili per animazioni di base
- Stili per menu dropdown

#### `theme.css` (259 linee)
Gestisce il sistema di temi (chiaro e scuro) dell'applicazione:
- Definisce variabili CSS per il tema chiaro (default)
- Definisce variabili CSS per il tema scuro
- Applica le variabili ai vari elementi dell'interfaccia
- Gestisce le transizioni tra temi
- Personalizza elementi specifici in base al tema
- Stili per il pulsante di cambio tema
- Ottimizzazione per la stampa (sempre in tema chiaro)

#### `forms.css` (157 linee)
Contiene gli stili specifici per i form dell'applicazione:
- Stili per il contenitore dei form
- Stili per gruppi di input
- Stili per etichette
- Stili per campi di input (testo, password, email, ecc.)
- Stili per aree di testo
- Stili per focus degli input
- Stili per input di file
- Stili per pulsanti di submit
- Stili per validazione dei form
- Stili per messaggi di errore nei form
- Responsività dei form
- Stili per input di valutazione
- Stili specifici per il form di login
- Stili per layout a griglia nei form complessi

#### `animations.css` (209 linee)
Definisce tutte le animazioni CSS utilizzate nell'applicazione:
- Animazione basic fade-in
- Animazione fade-in da sotto (fadeInUp)
- Animazione fade-in dall'alto (fadeInDown)
- Animazione slide-in da sinistra
- Animazione slide-in da destra
- Animazione pop-in
- Animazione shake per messaggi di errore
- Animazione pulse per elementi in evidenza
- Animazione ripple per pulsanti
- Animazione bounce
- Animazione rotate
- Classi di utilità per applicare le animazioni
- Classi per impostare ritardi nelle animazioni
- Animazioni per caricamento di card di libri e autori
- Animazioni in sequenza per elenchi (staggered animations)

#### `reviews.css` (323 linee)
Contiene gli stili specifici per il sistema di recensioni:
- Stili per il contenitore delle recensioni
- Stili per header delle recensioni
- Stili per filtri delle recensioni
- Stili per le singole recensioni
- Stili per recensioni verificate
- Stili per metadati delle recensioni (autore, data)
- Stili per badge di verifica
- Stili per valutazioni a stelle
- Stili per titoli e contenuti delle recensioni
- Stili per gestione degli spoiler
- Stili per pulsanti di azione nelle recensioni
- Stili per il sistema "Questa recensione è stata utile?"
- Stili per popup di messaggi
- Stili per il sistema di valutazione a stelle interattivo
- Stili per il form di scrittura recensioni
- Responsività per le recensioni

#### `search.css` (367 linee)
Definisce gli stili per il sistema di ricerca avanzata:
- Stili per il contenitore di ricerca
- Stili per il form di ricerca principale
- Stili per campo di input di ricerca
- Stili per pulsante di ricerca
- Stili per toggle di ricerca avanzata
- Stili per sezione di ricerca avanzata
- Stili per i campi della ricerca avanzata
- Stili per suggerimenti di ricerca
- Stili per cronologia delle ricerche
- Stili per azioni nella cronologia
- Stili per risultati di ricerca
- Stili per ordinamento dei risultati
- Responsività per il sistema di ricerca

### File JavaScript

#### `main.js` (213 linee)
File JavaScript principale che inizializza le funzionalità di base dell'applicazione:
- Event listener per il caricamento del documento
- Inizializzazione della navigazione
- Evidenziazione elemento attivo nel menu
- Gestione animazioni hover per link di navigazione
- Miglioramenti ai pulsanti con effetti di click
- Aggiunta effetto ripple ai pulsanti
- Dialoghi di conferma per pulsanti di eliminazione
- Validazione dei form in tempo reale
- Feedback visivo per errori di validazione
- Anteprima di immagini caricate
- Gestione menu dropdown

#### `theme.js` (92 linee)
Gestisce la funzionalità di cambio tema dell'applicazione:
- Inizializzazione del selettore di tema
- Creazione del pulsante di toggle del tema
- Controllo delle preferenze salvate dell'utente
- Rispetto delle preferenze del sistema operativo
- Funzione per cambiare tra tema chiaro e scuro
- Salvataggio delle preferenze in localStorage
- Aggiornamento visivo del pulsante di toggle
- Aggiunta di transizioni fluide durante il cambio tema

#### `animations.js` (103 linee)
Implementa le funzionalità di animazione dinamica:
- Inizializzazione delle animazioni al caricamento della pagina
- Applicazione della classe "loaded" alle card per innescare animazioni
- Animazioni fluide per hover sui pulsanti
- Utilizzo di Intersection Observer per animazioni basate sullo scroll
- Animazioni diverse in base alla posizione dell'elemento
- Funzione per applicare animazioni in sequenza a liste di elementi
- Funzione per innescare animazioni manualmente

#### `books.js` (196 linee)
Gestisce le funzionalità specifiche per i libri:
- Ricerca in tempo reale di libri nella pagina
- Filtri per elenchi di libri
- Sistema di valutazione a stelle
- Visualizzazione di valutazioni esistenti
- Input interattivi per nuove valutazioni
- Carosello per libri in evidenza
- Controllo dei pulsanti di navigazione del carosello
- Gestione del ridimensionamento della finestra per il carosello

#### `authors.js` (185 linee)
Implementa le funzionalità relative agli autori:
- Ricerca in tempo reale degli autori nella pagina
- Ordinamento dinamico degli autori per nome, nazionalità o numero di libri
- Animazioni in sequenza per l'elenco degli autori
- Toggle per la sezione dei libri correlati
- Animazioni per i libri quando vengono mostrati
- Anteprima e modifica delle immagini degli autori
- Rotazione di immagini e controlli di modifica

#### `reviews.js` (239 linee)
Gestisce il sistema di recensioni:
- Inizializzazione delle valutazioni a stelle
- Interattività per l'input di valutazione
- Descrizioni testuali per le valutazioni
- Filtri per le recensioni (valutazione, data, ecc.)
- Ordinamento delle recensioni
- Animazioni per mostrare/nascondere recensioni filtrate
- Sistema "Questa recensione è stata utile?"
- Salvataggio delle interazioni in localStorage
- Feedback visivo per le azioni dell'utente
- Toggle per contenuti con spoiler

#### `search.js` (329 linee)
Implementa il sistema di ricerca avanzata:
- Gestione del form di ricerca avanzata
- Toggle per mostrare/nascondere opzioni avanzate
- Animazioni per i campi di ricerca
- Salvataggio della ricerca nella cronologia
- Gestione della cronologia di ricerca in localStorage
- Visualizzazione della cronologia di ricerca
- Funzionalità per ripetere ricerche precedenti
- Eliminazione di elementi dalla cronologia
- Suggerimenti di ricerca in tempo reale
- Evidenziazione dei termini di ricerca nei suggerimenti
- Gestione del debounce per ottimizzare le prestazioni

### Frammenti Thymeleaf

#### `imports.html`
Contiene i frammenti per l'importazione di risorse CSS e JavaScript:
- Frammento principale per tutte le pagine
- Frammenti specifici per pagine di libri
- Frammenti specifici per pagine di autori
- Frammenti specifici per pagine di recensioni
- Frammenti specifici per pagine di ricerca
- Caricatore di script dinamico

#### `header.html`
Implementa l'header del sito con la barra di navigazione:
- Logo del sito
- Menu di navigazione principale
- Link condizionali in base allo stato di autenticazione
- Link per area amministrativa (solo per admin)
- Link per il profilo utente
- Toggle per il tema chiaro/scuro

#### `footer.html`
Implementa il footer del sito:
- Informazioni sul sito
- Link rapidi alle sezioni principali
- Link per autenticazione
- Informazioni di copyright
- Stili specifici per il footer

### Pagine HTML

#### `index.html`
La pagina principale del sito:
- Hero section con call to action
- Sezione features con icone
- CTA (call-to-action) per registrazione
- Animazioni per migliorare l'esperienza utente

#### `login.html`
Implementa la pagina di login:
- Form di autenticazione
- Gestione messaggi di errore
- Link per registrazione
- Feedback per registrazione completata

#### `error.html`
Pagina di gestione errori:
- Visualizzazione messaggi di errore
- Azioni per tornare alla home o indietro
- Icona di errore animata

## Funzionalità Frontend Avanzate

### Sistema di Tema (Chiaro/Scuro)

Il sistema di temi utilizza variabili CSS e attributi data per cambiare dinamicamente l'aspetto dell'applicazione:

```css
/* Variabili per il tema chiaro (default) */
:root {
    --primary-color: #2c3e50;
    --background-color: #f5f6fa;
    --card-bg-color: white;
    --text-color: #2c3e50;
    /* altre variabili... */
}

/* Variabili per il tema scuro */
[data-theme="dark"] {
    --primary-color: #ecf0f1;
    --background-color: #1a1a2e;
    --card-bg-color: #222246;
    --text-color: #ecf0f1;
    /* altre variabili... */
}
```

L'utente può cambiare tema tramite un pulsante nella barra di navigazione, e la preferenza viene salvata in localStorage:

```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Applica il tema
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('siwbooks-theme', newTheme);
    
    // Aggiorna lo stato del pulsante
    updateToggleState();
}
```

### Sistema di Animazioni

Le animazioni sono implementate utilizzando CSS e JavaScript. Alcune animazioni chiave:

- Effetto fade-in per elementi al caricamento della pagina
- Animazioni di entrata per elementi in sequenza (staggered animations)
- Transizioni fluide per hover e interazioni
- Animazioni basate su scroll con Intersection Observer API

```javascript
function initializeIntersectionObserver() {
    // Crea un observer per rilevare quando gli elementi entrano nel viewport
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Quando l'elemento è visibile, aggiungi la classe per animarlo
                    entry.target.classList.add('slide-in');
                }
            });
        });
        
        // Osserva tutti gli elementi con la classe 'animate-on-scroll'
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            animationObserver.observe(element);
        });
    }
}
```

### Sistema di Valutazione a Stelle

Per le recensioni, è stato implementato un sistema di valutazione a stelle interattivo:

```javascript
function initializeRatingStars() {
    // Per visualizzare stelle su valutazioni esistenti
    document.querySelectorAll('.rating-value').forEach(rating => {
        const ratingValue = parseFloat(rating.textContent || rating.value || '0');
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars-container');
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            if (i <= ratingValue) {
                star.classList.add('filled');
            } else if (i - 0.5 <= ratingValue) {
                star.classList.add('half-filled');
            }
            starsContainer.appendChild(star);
        }
        
        rating.parentNode.insertBefore(starsContainer, rating.nextSibling);
    });
    
    // Per input di valutazione interattivi
    // ...
}
```

## Possibili Modifiche e Miglioramenti

Di seguito sono elencate alcune modifiche che il professore potrebbe richiedere durante l'esame:

### 1. Miglioramenti al Backend

- **Implementazione caching**: Aggiungere caching per migliorare le prestazioni dell'applicazione
  ```java
  @EnableCaching
  @Configuration
  public class CacheConfig {
      @Bean
      public CacheManager cacheManager() {
          SimpleCacheManager cacheManager = new SimpleCacheManager();
          cacheManager.setCaches(Arrays.asList(
              new ConcurrentMapCache("books"),
              new ConcurrentMapCache("authors")
          ));
          return cacheManager;
      }
  }
  
  // Nel service
  @Cacheable("books")
  public List<Book> getAllBooks() {
      return bookRepository.findAll();
  }
  ```

- **Implementazione di API REST**: Aggiungere endpoint REST per consentire l'accesso ai dati da applicazioni client
  ```java
  @RestController
  @RequestMapping("/api/books")
  public class BookRestController {
      @Autowired
      private BookService bookService;
      
      @GetMapping
      public List<BookDTO> getAllBooks() {
          return bookService.getAllBooks().stream()
                 .map(this::convertToDTO)
                 .collect(Collectors.toList());
      }
      
      @GetMapping("/{id}")
      public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
          return bookService.getBookById(id)
                 .map(this::convertToDTO)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
      }
      
      private BookDTO convertToDTO(Book book) {
          // Conversione da entità a DTO
      }
  }
  ```

- **Implementazione di test di integrazione**: Aggiungere test per verificare l'interazione tra i vari componenti
  ```java
  @SpringBootTest
  @AutoConfigureMockMvc
  public class BookControllerIntegrationTest {
      @Autowired
      private MockMvc mockMvc;
      
      @Test
      public void testGetAllBooks() throws Exception {
          mockMvc.perform(get("/books"))
                 .andExpect(status().isOk())
                 .andExpect(view().name("books/list"))
                 .andExpect(model().attributeExists("books"));
      }
  }
  ```

### 2. Miglioramenti al Frontend

- **Implementazione di una modalità offline**: Utilizzare Service Workers per rendere l'applicazione funzionante offline
  ```javascript
  // In un file service-worker.js
  self.addEventListener('install', event => {
      event.waitUntil(
          caches.open('siwbooks-v1').then(cache => {
              return cache.addAll([
                  '/',
                  '/index.html',
                  '/css/styles.css',
                  '/js/main.js',
                  // altri asset essenziali...
              ]);
          })
      );
  });
  
  self.addEventListener('fetch', event => {
      event.respondWith(
          caches.match(event.request).then(response => {
              return response || fetch(event.request);
          })
      );
  });
  ```

- **Aggiunta di funzionalità di ricerca avanzata**: Migliorare il sistema di ricerca con filtri combinati e ordinamento
  ```javascript
  function performAdvancedSearch() {
      const title = document.getElementById('search-title').value;
      const author = document.getElementById('search-author').value;
      const genre = document.getElementById('search-genre').value;
      const yearFrom = document.getElementById('search-year-from').value;
      const yearTo = document.getElementById('search-year-to').value;
      
      // Costruisci i parametri di ricerca
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (author) params.append('author', author);
      if (genre) params.append('genre', genre);
      if (yearFrom) params.append('yearFrom', yearFrom);
      if (yearTo) params.append('yearTo', yearTo);
      
      // Esegui la ricerca
      window.location.href = `/books/search?${params.toString()}`;
  }
  ```

- **Miglioramento dell'accessibilità**: Assicurarsi che l'applicazione sia accessibile a tutti gli utenti
  ```html
  <!-- Esempio di miglioramento per l'accessibilità -->
  <button aria-label="Cerca" class="search-button">
      <i class="search-icon" aria-hidden="true"></i>
  </button>
  
  <!-- Gestione tabindex e focus per migliorare la navigazione da tastiera -->
  <script>
  function improveKeyboardNavigation() {
      document.querySelectorAll('.card').forEach(card => {
          card.setAttribute('tabindex', '0');
          card.addEventListener('keydown', function(e) {
              if (e.key === 'Enter') {
                  this.querySelector('a').click();
              }
          });
      });
  }
  </script>
  ```

### 3. Funzionalità Aggiuntive

- **Sistema di notifiche**: Implementare notifiche per nuove recensioni, risposte, ecc.
  ```java
  @Service
  public class NotificationService {
      @Autowired
      private UserRepository userRepository;
      
      public void sendNotification(User user, String title, String message) {
          Notification notification = new Notification();
          notification.setUser(user);
          notification.setTitle(title);
          notification.setMessage(message);
          notification.setCreatedAt(LocalDateTime.now());
          notification.setRead(false);
          
          notificationRepository.save(notification);
      }
      
      public List<Notification> getUnreadNotifications(User user) {
          return notificationRepository.findByUserAndReadFalse(user);
      }
  }
  ```

- **Integrazione con API esterne**: Aggiungere l'integrazione con API come Google Books per importare dati
  ```java
  @Service
  public class GoogleBooksService {
      private final RestTemplate restTemplate;
      private final String apiKey;
      
      public GoogleBooksService(@Value("${google.books.api.key}") String apiKey) {
          this.restTemplate = new RestTemplate();
          this.apiKey = apiKey;
      }
      
      public List<BookDTO> searchBooks(String query) {
          String url = "https://www.googleapis.com/books/v1/volumes?q=" + query + "&key=" + apiKey;
          GoogleBooksResponse response = restTemplate.getForObject(url, GoogleBooksResponse.class);
          
          return Optional.ofNullable(response)
                 .map(GoogleBooksResponse::getItems)
                 .orElse(Collections.emptyList())
                 .stream()
                 .map(this::convertToDTO)
                 .collect(Collectors.toList());
      }
      
      private BookDTO convertToDTO(GoogleBookItem item) {
          // Conversione da risposta API a DTO
      }
  }
  ```

- **Sistema di prenotazione**: Aggiungere funzionalità per prenotare libri
  ```java
  @Entity
  public class Reservation {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      @ManyToOne
      private User user;
      
      @ManyToOne
      private Book book;
      
      private LocalDate startDate;
      private LocalDate endDate;
      
      @Enumerated(EnumType.STRING)
      private ReservationStatus status;
      
      // getters, setters, etc.
  }
  
  public enum ReservationStatus {
      PENDING, CONFIRMED, CANCELLED, COMPLETED
  }
  ```

## Conclusione

SiwBooks è un'applicazione web completa che unisce funzionalità robuste a un'interfaccia utente moderna e intuitiva. Il progetto dimostra l'applicazione di vari pattern di progettazione e tecnologie web contemporanee.

Durante lo sviluppo, è stata data particolare attenzione all'esperienza utente, implementando funzionalità come il cambio di tema, animazioni fluide e un sistema di ricerca avanzato. L'architettura modulare del progetto facilita l'estensione e la manutenzione del codice.

Le possibili modifiche suggerite rappresentano direzioni di sviluppo futuro che potrebbero essere intraprese per espandere ulteriormente le capacità dell'applicazione.