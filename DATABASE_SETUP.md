# 🗄️ Database Initialization Guide

## 🔐 Authentication & Users Table

Αυτόματη δημιουργία πινάκων στη **MySQL**:

### ✅ Πίνακες που δημιουργούνται:

1. **contacts** - Επαφές χρηστών
2. **tickets** - Τα εισιτήρια (κύριος πίνακας)
3. **ticket_comments** - Σχόλια για κάθε εισιτήριο
4. **users** - Χρήστες και ρόλοι (NEW - για authentication)

---

## 👤 Users Table (NEW)

```sql
- id (Primary Key)
- username (Unique)
- password (hashed with bcrypt)
- email
- role (enum: 'admin', 'user')
- created_at
- updated_at
- Indexes: username, role
```

### Default Admin User

Μετά το deployment, δημιουργείται αυτόματα ένας default admin:

```
Username: admin
Password: admin123
Role: admin
⚠️ ΑΛΛΑΞΤΕ ΤΟ PASSWORD μετά την πρώτη σύνδεση!
```

---

## 🚂 Railway Deployment

### Αυτόματη Ρύθμιση

Όταν κάνεις deploy στο Railway:

1. **Railway παρέχει αυτόματα** τις MySQL connection variables
2. Το `initDb.js` τρέχει αυτόματα κατά την εκκίνηση
3. Δημιουργούνται αυτόματα οι πίνακες με τα σωστά indexes
4. Το `seedUsers.js` τρέχει αυτόματα και δημιουργεί τον default admin user

### Environment Variables στο Railway:

```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLUSER=root
MYSQLPASSWORD=your_password
MYSQLDATABASE=railway
MYSQLPORT=xxxx
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.railway.app
JWT_SECRET=your-very-long-and-secure-secret-key-here (change this!)
```

---

## 🚀 Τοπικό Development

### Επιλογή 1: Αυτόματα κατά την εκκίνηση (Προτείνεται)

```bash
npm start
```

Το `initDb.js` τρέχει αυτόματα και δημιουργεί όλους τους πίνακες.

---

### Επιλογή 2: Manual - Δημιουργία Πινάκων

```bash
npm run init-db  # Τρέχει το initDb.js αυτόματα
```

---

### Επιλογή 3: Δημιουργία Default Admin User

```bash
npm run seed-users
```

---

## 📋 Τι Δημιουργείται

### Πίνακας `users` (NEW)
```sql
- id (Primary Key)
- username (Unique, Indexed)
- password (bcrypt hashed)
- email
- role (admin, user)
- created_at
- updated_at
```

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
- status (open, in_progress, closed, stuck)
- priority (low, medium, high, urgent)
- assigned_to
- created_by
- created_at
- updated_at
- due_date
- category
- Indexes: status, priority, created_at
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

### `initDb.js` (Runtime initialization)
- Τρέχει αυτόματα όταν ξεκινά ο server
- Δημιουργεί όλους τους πίνακες (contacts, tickets, ticket_comments, users)
- Ασφαλές - δεν διαγράφει υπάρχοντα δεδομένα

### `seedUsers.js` (NEW - User seeding)
- Δημιουργεί τον default admin user
- Τρέχει με: `npm run seed-users`
- Ασφαλό - δεν ξαναδημιουργεί τον admin αν υπάρχει ήδη

---

## ✅ Ελέγξτε ότι Όλα Δημιουργήθηκαν

```bash
# Σύνδεση στη MySQL
mysql -u root -p your_database

# Προβολή πινάκων
SHOW TABLES;

# Προβολή δομής χρήστη
DESCRIBE users;
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

## 📦 Railway Deployment Steps

1. **Push κώδικα σε Git (όλα τα αρχεία)**
2. **Connect Railway με Git repo**
3. **Set environment variables στο Railway:**
   - MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT (Railway auto-provides)
   - JWT_SECRET (you set this - use a strong random string)
   - FRONTEND_URL
   
4. **Deploy** - Railway αυτόματα:
   - Τρέχει `npm install`
   - Τρέχει `initDb.js` (δημιουργεί πίνακες)
   - Τρέχει `seedUsers.js` (δημιουργεί default admin)
   - Ξεκινά τον server

---

Το database είναι έτοιμο για χρήση! 🚀
