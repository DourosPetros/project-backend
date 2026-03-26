# Ticketing System Backend

## 🚀 Quick Start

### Railway Deployment (Recommended)

1. **Connect to Railway**: Push code to GitHub, connect repo to Railway
2. **Add MySQL**: Railway dashboard → Add Plugin → MySQL
3. **Auto-deploy**: Railway automatically runs `npm run init-db` and starts server
4. **Get URL**: Railway provides your backend URL automatically

### Local Development

```bash
npm install
npm run init-db  # Δημιουργεί αυτόματα τις βάσεις MySQL
npm start
```

### Production Deploy

```bash
npm run setup  # Εγκαθιστά dependencies + τρέχει initDb.js αυτόματα
npm start
```

## 📋 Τι γίνεται κατά το Deploy

Όταν τρέχει το `npm run setup` ή `npm run init-db`:

1. **Εκτελείται το `initDb.js`** αυτόματα
2. Δημιουργούνται οι πίνακες: `contacts`, `tickets`, `ticket_comments`
3. Προστίθενται indexes για βελτιστοποίηση
4. Ο server είναι έτοιμος για χρήση

## 🔧 Scripts

- `npm start` - Ξεκινάει τον server
- `npm run init-db` - Τρέχει το initDb.js για δημιουργία βάσεων
- `npm run setup` - Πλήρης εγκατάσταση (install + init-db)
- `npm run seed` - Εναλλακτικό script για one-time setup

## 🌐 API Endpoints

- `GET /` - Health check
- `GET/POST/PUT/DELETE /contacts` - Διαχείριση επαφών
- `GET/POST/PUT/DELETE /tickets` - Διαχείριση tickets
- `GET/POST /tickets/:id/comments` - Σχόλια στα tickets

Server τρέχει στο port 8080 από default.