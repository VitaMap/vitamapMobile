require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000; // Fallback si non défini

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306 // Port MySQL (différent du PORT Express)
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    process.exit(1);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Permettre toutes les origines
  methods: ['GET', 'POST'], // Permettre les méthodes GET et POST
  allowedHeaders: ['Content-Type', 'Authorization'] // Permettre les en-têtes Content-Type et Authorization
}));
app.use(bodyParser.json());

// Route de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Rechercher l'utilisateur dans la base de données
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erreur du serveur:', err);
      return res.status(500).json({ message: 'Erreur du serveur', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    // Vérifier le mot de passe haché
    bcrypt.compare(password, user.mot_de_passe, (err, isMatch) => {
      if (err) {
        console.error('Erreur de comparaison de mot de passe:', err);
        return res.status(500).json({ message: 'Erreur du serveur', error: err });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      // Générer un token JWT sans SECRET_KEY
      const token = jwt.sign({ id: user.utilisateur_id, email: user.email }, 'default_secret', {
        expiresIn: '1h',
      });

      res.json({ message: 'Connexion réussie', token });
    });
  });
});

// Route de registration
app.post('/api/register', (req, res) => {
  const { nom, prenom, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erreur du serveur:', err);
      return res.status(500).json({ message: 'Erreur du serveur', error: err });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    // Hacher le mot de passe
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Erreur de hachage du mot de passe:', err);
        return res.status(500).json({ message: 'Erreur du serveur', error: err });
      }

      // Insérer le nouvel utilisateur dans la base de données
      db.query('INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)', [nom, prenom, email, hash], (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
          return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
      });
    });
  });
});

// Endpoint pour récupérer des données
app.get('/api/data', (req, res) => {
  res.json({ message: 'Données récupérées avec succès' });
});

// Endpoint pour récupérer les informations d'un utilisateur
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT id, nom, prenom, email, date_inscription FROM utilisateurs WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données utilisateur :', err);
      return res.status(500).json({ message: 'Erreur du serveur', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur Express sur http://localhost:${PORT}`);
  console.log(`MySQL sur 3306 (separé)`);
});