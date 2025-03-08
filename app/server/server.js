require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Charger les variables d'environnement
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
app.use(cors());
app.use(bodyParser.json());

const bcrypt = require('bcrypt');

// Route de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Password:', password);

  // Rechercher l'utilisateur dans la base de données
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erreur du serveur:', err);
      return res.status(500).json({ message: 'Erreur du serveur', error: err });
    }

    if (results.length === 0) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    console.log('Utilisateur trouvé:', user);

    // Vérifier le mot de passe haché
    bcrypt.compare(password, user.mot_de_passe, (err, isMatch) => {
      if (err) {
        console.error('Erreur de comparaison de mot de passe:', err);
        return res.status(500).json({ message: 'Erreur du serveur', error: err });
      }
      if (!isMatch) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

    // Générer un token JWT
    const token = jwt.sign({ id: user.utilisateur_id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ message: 'Connexion réussie', token });
  });
 });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});