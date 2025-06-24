# Setup Cloudinary per SiwBooks

## 1. Crea Account Cloudinary (Gratuito)

1. Vai su: https://cloudinary.com/users/register/free
2. Registrati con email
3. Verifica l'email

## 2. Ottieni le Credenziali

1. Vai sul Dashboard: https://cloudinary.com/console
2. Copia i seguenti valori:
   - **Cloud Name** (es: `dxxxxxab`)
   - **API Key** (es: `123456789012345`)
   - **API Secret** (es: `abcdefghijklmnopqrstuvwxyz123456`)

## 3. Configurazione per Heroku

```bash
# Sostituisci con i tuoi valori reali
heroku config:set CLOUDINARY_CLOUD_NAME=dxxxxxab --app tua-app
heroku config:set CLOUDINARY_API_KEY=123456789012345 --app tua-app
heroku config:set CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456 --app tua-app
```

## 4. Test Locale (Opzionale)

Per testare Cloudinary anche in locale, aggiungi al tuo file `application.properties`:

```properties
# Sostituisci con i tuoi valori
cloudinary.cloud-name=dxxxxxab
cloudinary.api-key=123456789012345
cloudinary.api-secret=abcdefghijklmnopqrstuvwxyz123456
```

## 5. Verifica Funzionamento

Dopo il deploy:
1. Carica un'immagine per un libro o autore
2. L'immagine dovrebbe apparire istantaneamente
3. L'URL dell'immagine dovrebbe iniziare con `https://res.cloudinary.com/`

## Piano Gratuito Cloudinary

- ✅ **25 GB** di storage
- ✅ **25,000** trasformazioni al mese
- ✅ **Bandwidth illimitato**
- ✅ **CDN globale**
- ✅ **Backup automatico**

Più che sufficiente per un progetto come SiwBooks!

## Struttura File su Cloudinary

I file verranno organizzati così:
```
siwbooks/
├── books/
│   ├── 1/
│   │   └── book_1_1234567890.jpg
│   ├── 2/
│   │   └── book_2_1234567891.jpg
└── authors/
    ├── 1/
    │   └── author_1_1234567892.jpg
    └── 2/
        └── author_2_1234567893.jpg
``` 