require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();



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


app.use(cors());
app.use(express.json());

// Middleware pour vérifier le token
const verifierToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  const token = authHeader.split(' ')[1];
  try {
    next(); // tu peux faire une vraie vérification ici si tu veux
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Route principale
app.get('/api/maladies-par-ville', /*verifierToken,*/ async (req, res) => {
  try {
    const response = await fetch(
        'https://raw.githubusercontent.com/VitaMap/VitaMapAPI/refs/heads/main/VitaMapAPI.json'
    );
    const data = await response.json();

    const resultat = formaterDonneesParVille(data);
    res.json(resultat);
  } catch (error) {
    console.error('Erreur fetch:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
});

// Fonction de formatage
// Fonction de formatage avec l'ajout des positions géographiques
function formaterDonneesParVille(data) {
  // On extrait les informations des données reçues : positions, lieu_maladie et maladies
  const { positions, lieu_maladie, maladies } = data;

  // Création d'une carte (objet) pour associer chaque position par son ID
  // On parcourt les positions et on les stocke dans un objet 'positionsMap' où la clé est l'ID de la position
  const positionsMap = positions.reduce((acc, pos) => {
    acc[pos.id] = pos;  // Chaque position est associée à son ID
    return acc;  // On retourne l'objet mis à jour
  }, {});

  // Création d'une carte (objet) pour associer chaque maladie par son ID
  // On parcourt les maladies et on les stocke dans un objet 'maladiesMap' où la clé est l'ID de la maladie
  const maladiesMap = maladies.reduce((acc, maladie) => {
    acc[maladie.id] = maladie;  // Chaque maladie est associée à son ID
    return acc;  // On retourne l'objet mis à jour
  }, {});

  // Création d'un objet 'villesMap' pour regrouper les informations par ville
  // Chaque ville sera une clé et contiendra un tableau de maladies
  const villesMap = {};

  // On parcourt tous les lieux où les maladies ont été observées
  lieu_maladie.forEach(lieu => {
    // On récupère la position associée au lieu à partir de son ID de position
    const position = positionsMap[lieu.position_id];
    // On récupère la maladie associée à ce lieu à partir de son ID de maladie
    const maladie = maladiesMap[lieu.maladie_id];

    // Si la position ou la maladie n'existent pas, on passe au suivant
    if (!position || !maladie) return;

    // On crée une clé unique pour la ville et le pays (par exemple, "Paris-France")
    const key = `${position.ville}-${position.pays}`;

    // Si cette clé de ville-pays n'existe pas encore dans 'villesMap', on l'ajoute
    if (!villesMap[key]) {
      villesMap[key] = {
        ville: position.ville,  // Nom de la ville
        pays: position.pays,    // Nom du pays
        position: position.position,  // Ajout des coordonnées géographiques sous forme de chaîne "latitude, longitude"
        maladies: []  // Tableau des maladies associées à cette ville
      };
    }

    // On ajoute la maladie à la liste des maladies pour cette ville
    villesMap[key].maladies.push({
      nom: maladie.nom,       // Nom de la maladie
      nombre_cas: lieu.nombre_cas,  // Nombre de cas observés pour cette maladie
      date_maj: lieu.date_maj  // Date de mise à jour des données
    });
  });

  // On retourne une liste des villes avec leurs informations formatées
  return Object.values(villesMap);  // 'Object.values' permet de récupérer un tableau des valeurs de l'objet 'villesMap'
}



app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


app.listen(PORT, () => {
  console.log(`Serveur Express sur http://localhost:${PORT}`);
  console.log(`MySQL sur 3306 (separé)`);
});