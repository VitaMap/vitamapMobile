CREATE TABLE maladies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR (255) NOT NULL,
    symptomes TEXT NOT NULL,
    description NOT NULL TEXT,
    niveau_contagion NOT NULL INT CHECK (niveau_contagion BETWEEN 1 AND 10)
);

CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR (60) NOT NULL,
    prenom VARCHAR (60) NOT NULL,
    email VARCHAR (100) NOT NULL,
    mot_de_passe VARCHAR (100) NOT NULL,
    date_inscription DATETIME NOT NULL
);

CREATE TABLE positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pays VARCHAR (100) NOT NULL,
    ville VARCHAR (100),
    position GEOMETRY
);

CREATE TABLE cas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    maladies INT,
    regions INT,
    date_detection DATE NOT NULL,
    nombre_cas INT DEFAULT (1) NOT NULL,
    foreign key (maladies) REFERENCES maladies (id),
    Foreign Key (regions) REFERENCES regions (id)
);