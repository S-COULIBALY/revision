# CONSTRUCTION D'UN PROJET

#### STACK TECHNIQUE

- [NodeJS](https://nodejs.org/en/download/) (v12 ou supérieure)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 ou supérieure)
- [Sqitch](https://sqitch.org/download/) (v1 ou supérieure)
- [Git](https://git-scm.com/downloads)
- [JWT]( https://jwt.io/#libraries-io , https://curity.io/resources/learn/jwt-best-practices/ )
- [Bcript](https://git-scm.com/downloads)
- [un client HTTP]() capable d'utiliser tous les verbes HTTP d'une API REST

#### MISE EN PLACE DE LA BDD

##### Réalisation du MCD (Mocodo) dans le dossier `conception`

- Entité
- Discriminant
- Attribut
- Association => Contrainte d'Intégrité Fonctionnelle ou Dépendance Fonctionnelle (CIF ou DF)

##### Création de la BDD<br>

`$ createdb nomDeLaBdd` => récrée la nouvelle table <br>
`$ dropdb nomDeLaBdd` => Si on veut la supprimer et la récréer
`sudo nano /etc/postgresql/12/main/pg_hba.conf` => si Postgresquel pg_hba n'est pas bien configurer pour acceder directement à la BDD (12 pour la version de postgresql, à changer si vous n'être en version 12)

##### Initialiser le projet node <br>

- `npm init -y`
- `npm i` (install) si c'est un projet reccuperer avec une package.json.

##### déployer le projet sqitch sur le projet

`$ sqitch init nom_base_de_donée --engine pg --top-dir migrations --target db:pg:nom_base_de_donée` <br>

##### Versionner avec sqitch <br>

- Création de la première migration sqitch
  `$ sqitch add NOM-DE-LA-MIGRATION -m "Création des tables"`
  <br>
- Création des tables et des domaines de la première dans transaction

- Deploy
  - exemple de code dans les fichiers `deploy`

```sql
BEGIN;

CREATE DOMAIN posint AS INT CHECK(value > 0);

CREATE TABLE nom_table (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL,
    editor TEXT NOT NULL,
    min_players posint NOT NULL,
    max_players posint NOT NULL,
    min_age posint NOT NULL,
    CHECK(min_players <= max_players)
);

COMMIT;
```

- Revert
  - exemple de code dans les fichiers `revert`

```sql
BEGIN;

DROP TABLE boardgame;
DROP DOMAIN posint;

COMMIT;
```

- Verify
  - exemple de code dans les fichiers `verify`

```sql
BEGIN;

SELECT id FROM boardgame WHERE false;

ROLLBACK;
```

- Deploiement et vérification des migrations dans le terminal <br>
  `$ sqitch status` <br>
  `$ sqitch deploy` <br>
  `$ sqitch verify` <br>
  `$ sqitch revert` <br>
  `$ sqitch deploy`
  <br>
- Création du script de seeding
  - exemple de SCRIPT de seeding

```sql
BEGIN;

INSERT INTO boardgame(name, author, editor, min_players, max_players, min_age) VALUES
('Risk', 'Albert Lamorisse, Michael I. Levin', 'Hasbro', 2, 6, 10),
('Trivial Pursuit', 'Chris Haney, Scott Abbott', 'Hasbro', 2, 6, 16),
('Docteur Maboule', 'John Spinello', 'Hasbro', 1, 10, 4),
('Labyrinthe', 'Max J. Kobbert', 'Ravensburger', 2, 4, 4);

COMMIT;
```

- Et dans le terminal pour exécuter <br>
  `$ psql -d boardgame -f ./data/seed_boardgame.sql`<br>
  ou quand on est déjà connecté la la bdd <br>
  `$ oquiz=> \i ./data/import_data.sql`
  <br>

##### Versionner avec GIT

- premier commit et le remote
  - Créer le nouveau projet sur Github `(New repository)` et faire le `premier push`

```
$ git init
$ git status
$ git add .
$ git commit -m "premier commit"
$ git remote add origin git@github.com:O-clock-Uther/portfolio-nicoclock.git
$ git push -u origin master
```

GIT: commits suivants et fermetures des issues avec (fix #1: n° de l'issues)

```
git status
git add .
git commit -m "fix #1 : mise en place BDD et data de test"
git push -u origin master
```

#### MISE EN PLACE DU SERVEUR EXPRESS

- Bien s'organiser: Lister les taches à faire avec la création de différents issues

##### installer les premiers packages et Création des fichier

`npm install express dotenv cors pg`
`npm i —-save-dev nodemon`

- Création des fichier cachés
  - .env et .env.exemple
  ```
  DATABASE_URL=postgresql://user:pwd@host/db
  ex: DATABASE_URL=postgresql://postgres:js4life@localhost/oblog
  PORT=
  NODE_ENV=development
  ```
  - sqitch.conf.example (sqitch.conf créer à l'initialisation de sqitch )
  - .gitignore (.env, sqitch.conf, node_modules)
    <br>
- Création du README.md
  <br>
- Créer les script de démarrage dans package.json:

```js
{
      "dev": nodemon index.js => npm run dev
      "start": nodemon index.js => npm start
      ou
      'start': 'npx nodemon index.js'  =>  si nodemon installé.
    }
```

<br>

##### point d'entrée pour l'appli

- exemple de code dans les fichiers `index.js`

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./app/router");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/v1", router);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
```

<br>
##### router et middleware 
- exemple de code dans les fichiers `router.js` dans `app`

```js
const { Router } = require("express");
const gameboardController = require("./controllers/boardgameController");

const { validateBody } = require("./services/validator");
const schema = require("./schemas/boardgame");

const router = Router();

/**
 * Test route
 * @route GET /v1/hello
 * @group Boardgames
 * @returns {string} 200 - 'Hello World' if the test is successfull
 */
router.get("/hello", (_, response) => response.json("Hello World !"));

/**
 * Respond with all boardgames in database
 * @route GET /v1/boardgames
 * @group Boardgames
 * @returns {Array<Boardgame>} 200 - An array of boardgames
 * @returns {string} 500 - An error message
 */
router.get("/boardgames", gameboardController.findAll);

router.get("/boardgames/:id(\\d+)", gameboardController.findOne);

/**
 * @typedef BoardgamePost
 * @property {number} id (optional)
 * @property {string} name
 * @property {string} author
 * @property {string} editor
 * @property {number} min_players
 * @property {number} max_players
 * @property {number} min_age
 */
//pour la doc de la route, à vous de jouer :-)
router.post("/boardgames/save", validateBody(schema), gameboardController.save);

module.exports = router;
```

<br>
##### fichier api.http pour tester la route
- exemple de code dans les fichiers `index.js`

```js
@host=http://localhost:3500/v1

### Route de test

GET {{host}}/hello

### Tous les jeux
GET {{host}}/boardgames

### Un jeux
GET {{host}}/boardgames/1

### Ajouter un jeu
POST {{host}}/boardgames/save
Content-Type: application/json

{
    "name": "Richesse du monde",
    "author": "Christian Pachis",
    "editor": "Lansay",
    "min_players": 2,
    "max_players": 6,
    "min_age": 88
}

### Modifier un jeu
POST {{host}}/boardgames/save
Content-Type: application/json

{
    "name": "Richesses du monde",
    "author": "Christian Pachis",
    "editor": "Lansay",
    "min_players": 2,
    "max_players": 6,
    "min_age": 8,
    "id": 5
}

### Nouveau jeu
POST {{host}}/boardgames/save
Content-Type: application/json

{
    "id": 9,
    "name": "'Mille bornes4",
    "author": "Pascal Jardin",
    "editor": "Dujardin",
    "min_players": 5,
    "max_players": 19,
    "min_age": 54
}

```

#### MISE EN PLACE DES LIENS AVEC LA BDD

##### connecteur à la BDD

- exemple de code dans les fichiers `database.js` dans `app`

```js
const { Pool } = require("pg");

const config = {
  connectionString: process.env.DATABASE_URL,
};

const pool = new Pool(config);

module.exports = pool;
```

<br>
#### MODEL
##### Migrations - création de fonctions sql
sql: les types `unknown` et `Record`
le cast => ``'25'::int``
json => ``->>`` l'opérateur pointé pour un objet json en sql
pour la création de fonctions sql des queries des  methodes de model findAll()`, `findOne()`, `save()` ...

- exemple de code dans les fichiers `deploy` dans `migrations`

```sql
-- Deploy boardgame:functions to pg

BEGIN;

-- version longue
-- CREATE FUNCTION new_boardgame(name TEXT, author TEXT, editor TEXT, min_players INT, max_players INT, min_age INT) RETURNS id AS $$
--     INSERT INTO boardgame(name, author, editor, min_players, max_players, min_age) VALUES(name, author, editor, min_players, max_players, min_age) RETURNING id;
-- $$ LANGUAGE SQL STRICT;

-- version courte
--                              $1   $2    $3    $4   $5   $6
CREATE FUNCTION new_boardgame(TEXT, TEXT, TEXT, INT, INT, INT) RETURNS INT AS $$
    INSERT INTO boardgame(name, author, editor, min_players, max_players, min_age) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;
$$ LANGUAGE SQL STRICT;


CREATE FUNCTION update_boardgame(text, text, text, int, int, int, int) RETURNS void AS $$
    UPDATE boardgame SET name=$1, author=$2, editor=$3, min_players=$4, max_players=$5, min_age=$6 WHERE id=$7;
$$ LANGUAGE SQL STRICT;



COMMIT;
```

- exemple de code dans les fichiers `revert` dans `migrations`

```sql
-- Revert boardgame:functions from pg

BEGIN;

DROP FUNCTION update_boardgame(text, text, text, int, int, int, int);
DROP FUNCTION new_boardgame(text, text, text, int, int, int);

COMMIT;
```

- exemple de code dans les fichiers `verify` dans `migrations`

```sql
-- Verify boardgame:functions on pg

BEGIN;

SELECT update_boardgame('', '', '', 1, 2, 3, 4);
SELECT new_boardgame('123', '', '', 1, 2, 3);

ROLLBACK;
```

<br>
##### Autre migrations pour l'export de toute la complexité en bdd (version requise)
- création de fonctions sql avec paramètre (objet json - transformation de l'objet stringifier réçu de pg en objet json dans postgresql)
<br>
  - [json_function.sql]() dans deploy

```sql
-- Deploy boardgame:json_functions to pg

BEGIN;

CREATE FUNCTION new_boardgame(myRecord json) RETURNS int AS $$
	INSERT INTO boardgame (name, author, editor, min_players, max_players, min_age)
	VALUES (
		myRecord->>'name',
		myRecord->>'author',
		myRecord->>'editor',
		(myRecord->>'min_players')::int,
		(myRecord->>'max_players')::int,
		(myRecord->>'min_age')::int
	) RETURNING id
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_boardgame(json) RETURNS void AS $$
    UPDATE boardgame SET
        name=$1->>'name',
        author=$1->>'author',
        editor=$1->>'editor',
        min_players=($1->>'min_players')::int,
        max_players=($1->>'max_players')::int,
        min_age=($1->>'min_age')::int
        WHERE id=($1->>'id')::int;
$$ LANGUAGE SQL STRICT;


COMMIT;
```

<br>

- [json_function.sql]() dans revert

```sql
-- Revert boardgame:json_functions from pg

BEGIN;

DROP FUNCTION new_boardgame(json);
DROP FUNCTION update_boardgame(json);

COMMIT;
```

  <br>

- [json_function.sql]() dans verify

```sql
-- Verify boardgame:json_functions on pg

BEGIN;

-- XXX Add verifications here.

ROLLBACK;
```

<br>
#####le Model

```js
const db = require("../database");

class NoBoardgameError extends Error {
  constructor(id) {
    super(`No boardgame with id ${id}`);
  }
}

/**
 * @typedef Boardgame
 * @property {number} id
 * @property {string} name
 * @property {string} author
 * @property {string} editor
 * @property {number} min_players
 * @property {number} max_players
 * @property {number} min_age
 */
class Boardgame {
  //pour tester la class d'une erreur sans avoir à l'importerr dans le contrôleur, on stocke cette class comme propriété statique du modèle
  static NoBoardgameError = NoBoardgameError;

  constructor(obj = {}) {
    for (const propName in obj) {
      this[propName] = obj[propName];
    }
  }

  /**
   * Retrieves all boardgames from database
   * @static
   * @async
   * @returns {Array<Boardgame>} all boardgames in database
   * @throws {Error} There's a problem with the request
   */ static async findAll() {
    try {
      const { rows } = await db.query("SELECT * FROM boardgame");
      return rows.map((row) => new Boardgame(row));
    } catch (error) {
      if (error.detail) {
        throw new Error(error.detail);
      } else {
        throw error;
      }
    }
  }

  /**
   * Retrieves a boardgame from database
   * @static
   * @async
   * @param {number} id
   * @returns {Boardgame} the instance identified with its id
   * @throws {Error} There's a problem with the request
   * @throws {NoBoardgameError} given id doesn't match with any record in database
   */
  static async findOne(id) {
    try {
      const { rows } = await db.query("SELECT * FROM boardgame WHERE id=$1", [
        id,
      ]);
      if (rows[0]) {
        return new Boardgame(rows[0]);
      }
      throw new NoBoardgameError(id);
    } catch (error) {
      if (error.detail) {
        throw new Error(error.detail);
      } else {
        throw error;
      }
    }
  }

  /**
   * Adds or updates an instance of Boardgame in database
   * @async
   * @returns {Boardgame} the inserted or updated instance
   * @throws {Error} There's a problem with the request
   */
  async save() {
    try {
      if (this.id) {
        await db.query("SELECT update_boardgame($1)", [this]);
      } else {
        const { rows } = await db.query("SELECT new_boardgame($1) AS id", [
          this,
        ]);
        this.id = rows[0].id;
        return this;
      }
    } catch (error) {
      console.log(error);
      if (error.detail) {
        throw new Error(error.detail);
      } else {
        throw error;
      }
    }
  }
}

module.exports = Boardgame;
```

<br>
### JOI

- [post.js]() dans dans le dossier `schema` <span style="color:#FE660F">à exporter dans le `router.js`</span>

```js
const Joi = require("joi");

const schema = Joi.object({
  //on indique le champ id qui peut être présent (UPDATE) ou pas (INSERT)
  //on prévoit le coup en indiquant que ce champ peut être optionnel
  id: Joi.number().integer().optional(),
  name: Joi.string().required(),
  author: Joi.string().required(),
  editor: Joi.string().required(),
  //même si la vérif que le nombre fourni est supérieur à 0 se fait déjà côté SQL, vaut mieux trop de vérifs que pas assez, Joi nous permet de checker ça également, on le fait
  min_players: Joi.number().integer().min(1).required(),
  // © Jérôme Karabenli
  max_players: Joi.number()
    .integer()
    .min(1)
    .greater(Joi.ref("schema.min_players"))
    .required(),
  min_age: Joi.number().integer().min(3).required(),
});

module.exports = schema;
```

<br>

- [validator.js]() dans dans le dossier `services` <span style="color:#FE660F">à exporter dans le `router.js`</span>

```js
const validator = {
  validateBody: (schema) => (request, response, next) => {
    const { error } = schema.validate(request.body);
    if (error) {
      return response.status(400).json(error.message);
    }
    next();
  },
  validateQuery: (schema) => (request, response, next) => {
    const { error } = schema.validate(request.query);
    if (error) {
      return response.status(400).json(error.message);
    }
    next();
  },
  validateParams: (schema) => (request, response, next) => {
    const { error } = schema.validate(request.params);
    if (error) {
      return response.status(400).json(error.message);
    }
    next();
  },
};
```

<br>
#### CONTROLLER
- [postController.js]() dans dans le dossier ``controllers``

```js
const { json } = require("express");
const Boardgame = require("../models/boardgame");

const boardgameController = {
  findAll: async (_, response) => {
    try {
      const boardgames = await Boardgame.findAll();
      response.json(boardgames);
    } catch (error) {
      response.status(500).send(error.message);
    }
  },

  findOne: async (request, response) => {
    try {
      const boardgame = await Boardgame.findOne(
        parseInt(request.params.id, 10)
      );
      response.json(boardgame);
    } catch (error) {
      if (error instanceof Boardgame.NoBoardgameError) {
        response.status(404).send(error.message);
      } else {
        response.status(500).send(error.message);
      }
    }
  },

  save: async (request, response) => {
    try {
      const boardgame = new Boardgame(request.body);
      const newGame = await boardgame.save();
      if (newGame) {
        //on a une valeur de retour, il s'agit d'un INSERT
        response.status(201).json(newGame);
      } else {
        //pas de valeur de retour, c'était un UPDATE
        response.status(204).json("Update done");
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  },
};

module.exports = boardgameController;
```

#### le plan de la mise en place serveur EXPRESS

- MODÈLE => model.js

CONTROLLER => controller.js

- définir le sujet
- MCD
- concevoir la BDD (migrations sqitch)
- seeding des tables pour jouer avec
- développer le serveur
  - app
  - router
  - controller
  - model
  - connecteur BDD
- faire vivre la BDD (autres migrations pour des fonctions, des vues, des domains, ...)
- doc API (swagger via JSDoc)
- README bien à nous, publiable car NOTRE propriété intellectuelle
  - on va définir ce que fait le code, la stack technique, comment installer et lancer le projet, ...
  - toutes les infos nécessaires pour utiliser le projet

<br>
<br>
 <span style="color:#FE660F"> POSTGRESQL</span>
###### CEER ET SE CONNECTER A UNE BASE POSTGRESQL SANS AUTHENTIFICATION PREALABLE
##### Création d’un utilisateur et d’une base de données
- Se connecter au Système (OS) avec l’utilisateur postgres
  - `sudo -i -u postgres` => (ou sudo su postgres sur MacOsX)
- Se connecter au server PostGres dans le terminal
  - `psql`=> on tape une fois connecté au système en tant que postgres,
    petit résumé des commandes postgreSQL « de base »
   ` \l` pour lister les base de données
   ` \du` pour lister les utilisateur (ou « roles ») existants
   ` \dt` pour lister les tables de la base de données courante

- Créer un utilisateur

  - `CREATE ROLE "nomDuLutilisateur" WITH LOGIN PASSWORD <‘une liste de droits’>;`
    Est équivalent à:
  - `createuser nomDuLutilisateur;`
    Quelques droits possibles
    `LOGIN` : donne le droit à l’utilisateur de se connecter
    `PASSWORD` 'leMotDePasse' : donne un mot de passe à l’utilisateur.

- Modifier un utilisateur existant

  - `ALTER ROLE nomDuLutilisateur WITH LOGIN PASSWORD <une liste de droits>;`

- Créer une base de données

  - `CREATE DATABASE nomDeLaBase OWNER nomDuLutilisateur;`
    ou
  - `createdb -U nom-du-user nomDeLaBase;`

- Se connecter à la base de données nouvellement créée, avec l’utilisateur nouvellement créé.
  Dans un nouveau terminal :
  `psql -U nomDeLutilisateur -d nomDeLaBase`

  - Note: par défaut, si on ne met pas -d nomDeLaBase, on se connecte automatiquement à la base de données qui porte le même nom que l’utilisateur.

- Executer les instructions SQL contenues dans un fichier MLD
  - `$ psql -U nomDeLutilisateur -d nomDeLaBase -f chemin/du/fichier.sql`

<br>
<br>
###### CEER ET SE CONNECTER A UNE BASE POSTGRESQL AVEC AUTHENTIFICATION PREALABLE
##### Configurer les accès à PostgrSQL dans le .bashrc

Cette manip est à faire une seule fois. Si vous l’avez déjà faite, ce n’est pas la peine de recommencer !
Par défaut dans PostGres, les utilisateurs systèmes n’ont pas le droit de se connecter avec `un login` différent de leur nom. (oui c’est pas simple comme phrase, et oui c’est bizarre comme réglage…)

- Ce qui veut dire que si je m’appelle « Worker », je peux me connecter à postgreSQL UNIQUEMENT en tant que « Worker », même si je suis super-utilisateur, et que j’ai tout les droits…
  <br>
- Pour pallier ça, il faut modifier le fichier /etc/postgresql/X/main/pg_hba.conf. (Remplacez X par la version de PostGreSQL installée)
  `sudo nano /etc/postgresql/12/main/pg_hba.conf`

Changer la ligne en :
`local all all peer` en `local all all md5`
`local all postgres md5` en `local all postgres trust`
Il vous faudra les droits super-user pour modifier ce fichier.

- Enfin, Ctrl + X pour quitter.
- Puis Ctrl + O pour sauvegarder.
- Entrée => pour sortir

\*\*\* `TODO`: Relancer le serveur PostGres Pour que les changements soient pris en compte

- sudo service postgresql reload ou
- sudo service postgresql restart

Maintenant pour se connecter sans saisir son mot de passe: `psql -U postgres`

##### Mettre à jour les variables d'environnement

- Dans la console de manière temporaire

  - lister les variables d'environnement
    `$ printenv` ou `printenv | sort`
  - définir la variable NODE_ENV à dev dans node
    `$ node`
    `$ export NODE_ENV=dev`
    ``$ export PORT=3500`
    et `process.env.NADE_ENV` pour y acceder

- Dans le fichier `.bashrc` de manière permanent

  - `$ nano .bashrc`
    `$ nano ~/.bashrc`
    dans `.bashrc` on ajoute les variables d'environnement qu'on souhaite:
  - ` export PGUSER=postgres` => pour permettre de se connecter à postgresql avec le bon user et faciliter le lancementde psql, createdb, dropbd et tous les autres utilitaires de postgresql ....

  - Recharger le fichier .bashrc
    `$ source .bashrc`

<br>
*** Pour retrouver le fichier pg_hba sur sa machine

```sql
$ find / -type f -name "pg_hba.conf"
ou
psql -U postgres
postgres=# SHOW hba_file;
/etc/postgresql/12/main/pg_hba.conf
postgres=# \q
```

todo: Se connecter au server POSTGRES en tant que user postgres pour faire du DDL

TODO: DDL (create, alter, drop) => BDD Structure Life

```sql
BEGIN;

CREATE SCHEMA visitor;

ALTER TABLE visitor SET SCHEMA visitor;
ALTER TABLE visitor_books_attraction SET SCHEMA visitor;

CREATE SCHEMA technician;
ALTER TABLE technician SET SCHEMA technician;
ALTER TABLE incident SET SCHEMA technician;
ALTER TABLE attraction SET SCHEMA technician;

COMMIT;

BEGIN;

CREATE ROLE group_visitor WITH LOGIN PASSWORD 'group_visitor';

GRANT USAGE ON SCHEMA visitor TO group_visitor;

GRANT SELECT, UPDATE ON TABLE visitor.visitor TO group_visitor;
GRANT SELECT, UPDATE ON TABLE visitor.visitor_books_attraction TO group_visitor;

CREATE ROLE group_technician WITH LOGIN PASSWORD 'technician';

GRANT USAGE ON SCHEMA technician to group_technician;

GRANT SELECT ON TABLE technician.technician TO group_technician;
GRANT SELECT, UPDATE ON TABLE technician.incident TO group_technician;
GRANT SELECT, UPDATE ON TABLE technician.attraction TO group_technician;

COMMIT;

BEGIN;

CREATE VIEW visitor.attraction AS
SELECT \* FROM technician.attraction;

GRANT SELECT ON visitor.attraction TO group_visitor;

COMMIT;
```
