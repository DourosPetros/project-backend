# 🗄️ Database Initialization Guide

## Αυτόματη Δημιουργία Πινάκων

Το σύστημα ticketing χρειάζεται 3 πίνακες στη MySQL:

### ✅ Πίνακες που δημιουργούνται:

1. **contacts** - Επαφές χρηστών
2. **tickets** - Τα εισιτήρια (κύριος πίνακας)
3. **ticket_comments** - Σχόλια για κάθε εισιτήριο

---

## 🚀 Πώς να Τρέξετε το Setup

### Επιλογή 1: Αυτόματα κατά την εκκίνηση (Προτείνεται)

```bash
npm start
```

Το `initDb.js` τρέχει αυτόματα και δημιουργεί όλους τους πίνακες.

---

### Επιλογή 2: Manual - Μόνο DB Setup

Αν θέλετε να δημιουργήσετε τους πίνακες χωρίς να ξεκινήσετε τον server:

```bash
npm run seed
# ή
npm run init-db
```

---

### Επιλογή 3: Deploy Setup (Production)

```bash
npm run setup
# που τρέχει: npm install && npm run seed
```

---

## 📋 Τι Δημιουργείται

### Πίνακας `contacts`
```sql
- id (Primary Key)
- first_name
- last_name
- phone
- created_at
```

### Πίνακας `tickets`
```sql
- id (Primary Key)
- title (Required)
- description
- status (open, in_progress, closed, on_hold)
- priority (low, medium, high, urgent)
- assigned_to
- created_by
- created_at
- updated_at
- due_date
- category
- Indexes: status, priority, created_at, assigned_to
```

### Πίνακας `ticket_comments`
```sql
- id (Primary Key)
- ticket_id (Foreign Key → tickets)
- comment_text
- created_by
- created_at
- Cascade Delete on ticket deletion
```

---

## 🔧 Αρχεία που Ενεργοποιούν τη Δημιουργία

### `seed.js` (Standalone script)
- Μπορεί να τρέξει ανεξάρτητα με `npm run seed`
- Χρήσιμο για development & testing

### `initDb.js` (Runtime initialization)
- Τρέχει αυτόματα όταν ξεκινά ο server
- Ασφαλές - δεν δημιουργεί τους ίδιους πίνακες δύο φορές

---

## ✅ Ελέγξτε ότι Όλα Δημιουργήθηκαν

```bash
# Σύνδεση στη MySQL
mysql -u root -p your_database

# Προβολή πινάκων
SHOW TABLES;

# Προβολή δομής ενός πίνακα
DESCRIBE tickets;
```

---

## 🚨 Troubleshooting

### "Connection refused"
```bash
# Ελέγξτε ότι MySQL τρέχει
sudo service mysql start  # Linux
brew services start mysql # Mac
# ή ανοίξτε MySQL Workbench
```

### "Database doesn't exist"
```bash
# Δημιουργήστε τη βάση πρώτα
mysql -u root -p -e "CREATE DATABASE ticketing_system;"
```

### "Tables already exist"
Δεν είναι πρόβλημα! Το script χρησιμοποιεί `CREATE TABLE IF NOT EXISTS`, άρα:
- ✅ Δημιουργεί τους πίνακες αν δεν υπάρχουν
- ✅ Δεν τους διαγράφει ούτε τα δεδομένα

---

## 📦 Deploy Steps

Για production deployment:

```bash
# 1. Εγκατάσταση dependencies
npm install

# 2. Δημιουργία πινάκων
npm run init-db

# 3. Εκκίνηση server
npm start
```

ή με ένα command:

```bash
npm run setup && npm start
```

---

## 🔄 Ενημέρωση Σχήματος (Future)

Αν χρειαστείτε να προσθέσετε νέες στήλες:

1. Ενημερώστε το `seed.js` (προσθέστε τη νέα στήλη)
2. Ενημερώστε και το `initDb.js` για consistency
3. Τρέξτε `npm run init-db` για ενημέρωση

---

Το database είναι έτοιμο για χρήση! 🚀
