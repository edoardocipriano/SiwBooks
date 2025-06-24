# Deploy SiwBooks su Heroku

## Prerequisiti
1. Account Heroku: https://signup.heroku.com/
2. Heroku CLI installato: https://devcenter.heroku.com/articles/heroku-cli

## Passi per il Deploy

### 1. Login e Creazione App
```bash
# Login su Heroku
heroku login

# Crea una nuova app (sostituisci 'siwbooks-tuonome' con un nome unico)
heroku create siwbooks-tuonome

# Aggiungi l'addon PostgreSQL (gratuito fino a 10k righe)
heroku addons:create heroku-postgresql:essential-0 --app siwbooks-tuonome
```

### 2. Configurazione Cloudinary (Storage Permanente)
Prima di procedere, crea un account gratuito su Cloudinary:
1. Vai su https://cloudinary.com/users/register/free
2. Dopo la registrazione, vai su Dashboard
3. Copia `Cloud Name`, `API Key` e `API Secret`

### 3. Configurazione Variabili di Ambiente
```bash
# Configurazione Admin
heroku config:set ADMIN_USERNAME=tuo_admin_username --app siwbooks-tuonome
heroku config:set ADMIN_PASSWORD=tua_password_sicura --app siwbooks-tuonome

# Configurazione Cloudinary (sostituisci con i tuoi valori)
heroku config:set CLOUDINARY_CLOUD_NAME=tuo_cloud_name --app siwbooks-tuonome
heroku config:set CLOUDINARY_API_KEY=tua_api_key --app siwbooks-tuonome
heroku config:set CLOUDINARY_API_SECRET=tua_api_secret --app siwbooks-tuonome

# Verifica le configurazioni
heroku config --app siwbooks-tuonome
```

### 4. Deploy dell'Applicazione
```bash
# Aggiungi remote Heroku
git remote add heroku https://git.heroku.com/siwbooks-tuonome.git

# Commit delle modifiche per Heroku
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy su Heroku
git push heroku main
```

### 5. Verificare il Deploy
```bash
# Apri l'app nel browser
heroku open --app siwbooks-tuonome

# Controlla i log se ci sono problemi
heroku logs --tail --app siwbooks-tuonome
```

## Migrazione Dati dal Database Locale

### Esportare dati dal database locale
```bash
# Crea un dump del database locale
pg_dump -h localhost -U postgres -d siwbooks > backup.sql
```

### Importare dati nel database Heroku
```bash
# Ottieni l'URL del database Heroku
heroku config:get DATABASE_URL --app siwbooks-tuonome

# Importa i dati (sostituisci DATABASE_URL con l'URL ottenuto sopra)
psql DATABASE_URL < backup.sql
```

## Gestione File Permanente

✅ **RISOLTO**: L'applicazione ora usa **Cloudinary** per lo storage permanente dei file!

### Caratteristiche Cloudinary:
- **Storage permanente** - I file non vengono mai persi
- **CDN globale** - Caricamento veloce in tutto il mondo
- **Ottimizzazione automatica** - Ridimensionamento e compressione automatici
- **Piano gratuito generoso** - 25 GB storage, 25k trasformazioni/mese

### Come Funziona:
- **In produzione (Heroku)**: Usa automaticamente Cloudinary
- **In sviluppo locale**: Usa il filesystem locale come prima
- **Fallback intelligente**: Se Cloudinary non funziona, usa il filesystem locale

### Variabili di Ambiente Utili
```bash
# Per debugging
heroku config:set SPRING_PROFILES_ACTIVE=heroku --app siwbooks-tuonome

# Per aumentare memoria JVM se necessario
heroku config:set JAVA_OPTS="-Xmx300m -Xss512k" --app siwbooks-tuonome
```

## Comandyi Utili

```bash
# Restart dell'app
heroku restart --app siwbooks-tuonome

# Accesso ai log
heroku logs --tail --app siwbooks-tuonome

# Accesso al database
heroku pg:psql --app siwbooks-tuonome

# Informazioni sull'app
heroku info --app siwbooks-tuonome
```

## Risoluzione Problemi Comuni

1. **Build fallisce**: Controlla che Java 21 sia specificato in `system.properties`
2. **Database non si connette**: Verifica che `DATABASE_URL` sia impostata automaticamente
3. **App non si avvia**: Controlla i log con `heroku logs --tail`
4. **Errori di memoria**: Riduci il logging o aumenta la memoria con JAVA_OPTS 