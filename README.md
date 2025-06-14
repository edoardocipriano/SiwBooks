# SiwBooks - Sistema di Gestione Libri e Recensioni

## Descrizione del Progetto

SiwBooks è un'applicazione web sviluppata con Spring Boot per la gestione di libri, autori e recensioni. Il sistema permette agli utenti di visualizzare libri, leggere recensioni e agli amministratori di gestire il catalogo completo.

## Tecnologie Utilizzate

- **Java 21** - Linguaggio di programmazione principale
- **Spring Boot 3.5.0** - Framework per lo sviluppo dell'applicazione
- **Spring Security** - Gestione autenticazione e autorizzazione
- **Spring Data JPA** - Persistenza dei dati
- **Thymeleaf** - Template engine per le viste
- **PostgreSQL** - Database relazionale
- **Lombok** - Riduzione del boilerplate code
- **Maven** - Gestione delle dipendenze e build

---

## Struttura del Progetto

### File di Configurazione Root

#### `pom.xml`
File di configurazione Maven che definisce:
- Dipendenze del progetto (Spring Boot, Spring Security, PostgreSQL, Thymeleaf, Lombok)
- Plugin per la compilazione e il packaging
- Configurazione Java 21
- Metadati del progetto (groupId: it.siwbooks, artifactId: siwbooks)

#### `.gitignore`
File che specifica quali file e directory devono essere ignorati da Git:
- File di build (`target/`)
- File IDE (`.vscode/`, `.idea/`)
- File di sistema (`.DS_Store`)
- File di configurazione locale

#### `.gitattributes`
Configurazione degli attributi Git per la gestione dei line endings e altri aspetti del versioning.

#### `HELP.md`
File di documentazione generato da Spring Boot con informazioni di base sul progetto.

#### `mvnw` e `mvnw.cmd`
Maven Wrapper scripts per Linux/Mac (`mvnw`) e Windows (`mvnw.cmd`) che permettono di eseguire Maven senza averlo installato globalmente.

---

### Directory `.mvn/`

#### `.mvn/wrapper/maven-wrapper.properties`
Configurazione del Maven Wrapper che specifica la versione di Maven da utilizzare e l'URL per il download.

---

### Directory `.vscode/`

#### `.vscode/settings.json`
Configurazioni specifiche per Visual Studio Code per questo progetto.

---

### Directory `src/main/java/it/siwbooks/`

#### `SiwbooksApplication.java`
Classe principale dell'applicazione Spring Boot:
- Annotata con `@SpringBootApplication`
- Abilita la gestione delle transazioni con `@EnableTransactionManagement`
- Contiene il metodo `main()` per l'avvio dell'applicazione

---

### Package `controller/`

#### `MainController.java`
Controller principale che gestisce le rotte di base:
- Pagina home (`/`)
- Gestione degli errori generali
- Redirect e navigazione principale

#### `BookController.java`
Controller per la gestione dei libri:
- Visualizzazione lista libri (`/books`)
- Dettagli libro singolo (`/books/{id}`)
- Creazione nuovo libro (solo admin) (`/admin/books/new`)
- Modifica libro esistente (solo admin) (`/admin/books/{id}/edit`)
- Eliminazione libro (solo admin)
- Ricerca libri per titolo e autore

#### `AuthorController.java`
Controller per la gestione degli autori:
- Lista autori (`/authors`)
- Dettagli autore (`/authors/{id}`)
- Creazione e modifica autori (solo admin)
- Gestione delle immagini degli autori

#### `ReviewController.java`
Controller più complesso per la gestione delle recensioni:
- Visualizzazione recensioni per libro
- Creazione nuove recensioni (utenti autenticati)
- Modifica recensioni esistenti (solo proprietario)
- Eliminazione recensioni (proprietario o admin)
- Sistema di rating con stelle
- Validazione dei dati delle recensioni

#### `UserController.java`
Controller per la gestione degli utenti:
- Registrazione nuovi utenti (`/register`)
- Profilo utente (`/profile`)
- Gestione dati utente
- Creazione amministratori (solo admin)

#### `FileController.java`
Controller specializzato per la gestione dei file:
- Upload immagini per libri e autori
- Servizio delle immagini statiche
- Validazione formati file supportati
- Gestione errori di upload

---

### Package `model/`

#### `Book.java`
Entità principale che rappresenta un libro:
- Campi: `id`, `title`, `publicationYear`
- Relazioni: Many-to-Many con `Author`, One-to-Many con `Image` e `Review`
- Annotazioni JPA per la persistenza
- Lombok per getter/setter automatici

#### `Author.java`
Entità che rappresenta un autore:
- Campi: `id`, `name`, `surname`, `dateOfBirth`, `dateOfDeath`
- Relazione Many-to-Many con `Book`
- One-to-Many con `Image` per foto dell'autore

#### `Review.java`
Entità per le recensioni dei libri:
- Campi: `id`, `title`, `content`, `rating`, `createdAt`
- Relazioni: Many-to-One con `Book` e `User`
- Sistema di rating da 1 a 5 stelle

#### `User.java`
Entità per gli utenti del sistema:
- Campi: `id`, `username`, `email`, `password`
- Relazione con `Role` per i permessi
- One-to-Many con `Review`

#### `Image.java`
Entità per la gestione delle immagini:
- Campi: `id`, `filename`, `originalName`
- Relazioni con `Book` e `Author`
- Gestione dei percorsi dei file

#### `Role.java`
Enum per i ruoli utente:
- `USER` - Utente normale
- `ADMIN` - Amministratore

---

### Package `repository/`

#### `BookRepository.java`
Repository per l'accesso ai dati dei libri:
- Estende `JpaRepository<Book, Long>`
- Query personalizzate per ricerca per titolo
- Metodi per trovare libri per autore

#### `AuthorRepository.java`
Repository per gli autori:
- Query per ricerca per nome e cognome
- Metodi per statistiche autori

#### `ReviewRepository.java`
Repository per le recensioni:
- Query per trovare recensioni per libro
- Query per recensioni per utente
- Calcolo rating medio per libro
- Ordinamento per data di creazione

#### `UserRepository.java`
Repository per gli utenti:
- Ricerca per username ed email
- Validazione unicità credenziali

#### `ImageRepository.java`
Repository per le immagini:
- Gestione associazioni con libri e autori
- Query per cleanup immagini orfane

---

### Package `service/`

#### `BookService.java`
Servizio per la logica di business dei libri:
- Operazioni CRUD complete
- Validazione dati libro
- Gestione relazioni con autori
- Calcolo statistiche

#### `AuthorService.java`
Servizio per la gestione degli autori:
- Creazione e aggiornamento autori
- Validazione date di nascita/morte
- Gestione immagini profilo

#### `ReviewService.java`
Servizio complesso per le recensioni:
- Validazione recensioni (un utente può recensire un libro una sola volta)
- Calcolo rating medio
- Gestione permessi (modifica solo del proprietario)
- Ordinamento e paginazione

#### `UserService.java`
Servizio per la gestione utenti:
- Registrazione nuovi utenti
- Crittografia password
- Gestione ruoli e permessi
- Validazione dati utente

#### `FileStorageService.java`
Servizio specializzato per la gestione dei file:
- Upload sicuro delle immagini
- Validazione formati (JPEG, PNG, GIF)
- Generazione nomi file unici
- Gestione directory di upload
- Pulizia file orfani

---

### Package `security/`

#### `WebSecurityConfig.java`
Configurazione principale della sicurezza:
- Definizione delle rotte protette
- Configurazione login/logout
- Gestione dei ruoli (USER/ADMIN)
- Configurazione CSRF
- Gestione delle sessioni

#### `CustomUserDetailsService.java`
Servizio personalizzato per l'autenticazione:
- Implementa `UserDetailsService` di Spring Security
- Carica i dettagli utente dal database
- Gestione dei ruoli per l'autorizzazione

---

### Package `config/`

#### `DatabaseConfig.java`
Configurazione del database:
- Impostazioni connection pool
- Configurazione transazioni
- Ottimizzazioni performance database

#### `DataInitializer.java`
Inizializzatore dei dati di esempio:
- Creazione utente admin di default
- Popolamento database con dati di test
- Esecuzione al primo avvio dell'applicazione

---

### Package `dto/`

#### `UserForm.java`
Data Transfer Object per i form utente:
- Validazione input utente
- Binding dati form HTML
- Separazione tra entità e presentazione

---

### Directory `src/main/resources/`

#### `application.properties`
File di configurazione principale dell'applicazione:
- **Database**: Configurazione PostgreSQL (URL, credenziali, driver)
- **JPA/Hibernate**: Impostazioni ORM (DDL auto-update, SQL logging)
- **Thymeleaf**: Configurazione template engine
- **Upload**: Directory per il salvataggio delle immagini
- **Security**: Credenziali admin di default
- **Server**: Porta e configurazioni server

#### `META-INF/additional-spring-configuration-metadata.json`
Metadati aggiuntivi per la configurazione Spring Boot, utilizzati dall'IDE per l'autocompletamento.

---

### Directory `src/main/resources/static/`

#### Sottodirectory `css/`

##### `styles.css`
Foglio di stile principale (1359 righe):
- Layout generale dell'applicazione
- Stili per header, footer, navigation
- Responsive design per mobile e desktop
- Temi colore e tipografia

##### `forms.css`
Stili specifici per i form (601 righe):
- Styling input, textarea, select
- Validazione visuale campi
- Layout form responsive
- Stili per bottoni e controlli

##### `reviews.css`
Stili per il sistema di recensioni (552 righe):
- Visualizzazione stelle rating
- Layout recensioni
- Stili per commenti e feedback
- Animazioni interattive

##### `search.css`
Stili per la funzionalità di ricerca (367 righe):
- Barra di ricerca
- Risultati di ricerca
- Filtri e ordinamento
- Suggerimenti di ricerca

##### `theme.css`
Gestione temi e variabili CSS (295 righe):
- Variabili colore globali
- Temi chiaro/scuro
- Configurazioni responsive
- Utilità CSS

##### `animations.css`
Animazioni e transizioni (209 righe):
- Animazioni di caricamento
- Transizioni smooth
- Effetti hover e focus
- Animazioni di feedback

#### Sottodirectory `js/`

##### `main.js`
JavaScript principale (221 righe):
- Inizializzazione applicazione
- Gestione eventi globali
- Utilità comuni
- Integrazione componenti

##### `modern.js`
Funzionalità JavaScript moderne (555 righe):
- Gestione asincrona
- Fetch API per chiamate AJAX
- Gestione errori avanzata
- Componenti interattivi

##### `reviews.js`
JavaScript per il sistema recensioni (362 righe):
- Sistema di rating interattivo
- Validazione form recensioni
- Aggiornamento dinamico rating
- Gestione commenti

##### `search.js`
Funzionalità di ricerca (329 righe):
- Ricerca in tempo reale
- Autocompletamento
- Filtri dinamici
- Gestione risultati

##### `books.js`
JavaScript specifico per i libri (196 righe):
- Gestione galleria immagini
- Interazioni pagina dettaglio libro
- Validazione form libro

##### `authors.js`
JavaScript per gli autori (185 righe):
- Gestione profili autori
- Upload immagini autore
- Validazione dati biografici

##### `animations.js`
Controllo animazioni JavaScript (103 righe):
- Animazioni programmatiche
- Controllo timing
- Gestione performance animazioni

#### Sottodirectory `uploads/`
Directory per il salvataggio delle immagini caricate dagli utenti, organizzata per ID entità.

---

### Directory `src/main/resources/templates/`

#### `index.html`
Homepage dell'applicazione (144 righe):
- Layout principale
- Presentazione libri in evidenza
- Navigazione principale
- Sezioni informative

#### `login.html`
Pagina di login (42 righe):
- Form di autenticazione
- Gestione errori login
- Link registrazione
- Styling sicurezza

#### `error.html`
Pagina di errore personalizzata (75 righe):
- Gestione errori HTTP
- Messaggi user-friendly
- Navigazione di recupero
- Logging errori

#### Sottodirectory `fragments/`

##### `header.html`
Fragment per l'header (50 righe):
- Navigazione principale
- Menu utente
- Logo e branding
- Responsive navigation

##### `footer.html`
Fragment per il footer (109 righe):
- Informazioni applicazione
- Link utili
- Copyright e crediti
- Social links

##### `imports.html`
Fragment per gli import CSS/JS (140 righe):
- Import fogli di stile
- Script JavaScript
- Meta tags
- Configurazioni head

#### Sottodirectory `books/`

##### `list.html`
Lista libri (35 righe):
- Griglia libri
- Paginazione
- Filtri di ricerca
- Link dettagli

##### `details.html`
Dettagli libro (93 righe):
- Informazioni complete libro
- Galleria immagini
- Lista autori
- Sezione recensioni

##### `form.html`
Form creazione/modifica libro (153 righe):
- Form completo libro
- Upload immagini
- Selezione autori
- Validazione client-side

#### Sottodirectory `authors/`

##### `list.html`
Lista autori (35 righe):
- Griglia autori
- Informazioni biografiche base
- Link ai dettagli

##### `details.html`
Dettagli autore (42 righe):
- Biografia completa
- Lista libri dell'autore
- Immagini autore

##### `form.html`
Form autore (167 righe):
- Dati biografici
- Upload foto
- Validazione date
- Gestione campi opzionali

#### Sottodirectory `reviews/`

##### `form.html`
Form recensione (140 righe):
- Sistema rating stelle
- Textarea commento
- Validazione recensione
- Preview recensione

#### Sottodirectory `user/`

##### `register.html`
Registrazione utente (41 righe):
- Form registrazione
- Validazione password
- Termini e condizioni

##### `profile.html`
Profilo utente (19 righe):
- Informazioni utente
- Recensioni dell'utente
- Impostazioni account

#### Sottodirectory `admin/`

##### `create-admin.html`
Creazione amministratore (41 righe):
- Form creazione admin
- Validazione privilegi
- Sicurezza avanzata

---

### Directory `src/test/`

#### `src/test/java/it/siwbooks/siwbooks/SiwbooksApplicationTests.java`
Test di base dell'applicazione:
- Test di caricamento del context Spring
- Verifica configurazione base
- Test di integrazione minimali

---

## Funzionalità Principali

### Per gli Utenti
- **Visualizzazione Catalogo**: Browsing libri e autori
- **Sistema Recensioni**: Creazione e gestione recensioni personali
- **Ricerca Avanzata**: Ricerca per titolo, autore, anno
- **Profilo Utente**: Gestione account e recensioni

### Per gli Amministratori
- **Gestione Catalogo**: CRUD completo per libri e autori
- **Gestione Utenti**: Creazione amministratori
- **Gestione Contenuti**: Moderazione recensioni
- **Upload Media**: Gestione immagini libri e autori

## Sicurezza

- **Autenticazione**: Spring Security con login form-based
- **Autorizzazione**: Controllo accessi basato su ruoli
- **Validazione**: Validazione input lato server e client
- **CSRF Protection**: Protezione da attacchi cross-site
- **Password Encryption**: Crittografia password con BCrypt

## Database

Il sistema utilizza PostgreSQL con le seguenti tabelle principali:
- `book` - Informazioni libri
- `author` - Dati autori
- `book_author` - Relazione many-to-many libri-autori
- `review` - Recensioni utenti
- `user` - Utenti sistema
- `image` - Metadati immagini

## Avvio dell'Applicazione

1. **Prerequisiti**:
   - Java 21
   - PostgreSQL
   - Maven (opzionale, incluso wrapper)

2. **Configurazione Database**:
   - Creare database `siwbooks`
   - Configurare credenziali in `application.properties`

3. **Avvio**:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Accesso**:
   - URL: `http://localhost:8080`
   - Admin: username `admin`, password `admin`

## Struttura Architetturale

L'applicazione segue il pattern **MVC (Model-View-Controller)** con:
- **Model**: Entità JPA nel package `model`
- **View**: Template Thymeleaf in `templates`
- **Controller**: Controller Spring MVC nel package `controller`
- **Service Layer**: Logica di business nel package `service`
- **Repository Layer**: Accesso dati con Spring Data JPA

La separazione dei concern è mantenuta attraverso:
- **DTO**: Per il trasferimento dati
- **Security**: Configurazione sicurezza separata
- **Config**: Configurazioni applicazione centralizzate