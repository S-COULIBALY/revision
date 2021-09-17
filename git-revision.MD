[Recap git](https://github.com/O-clock-Uther/playlist-blue) (lien vers la fiche récap du prof Nicolas charpin)

##### Cycle de versionning

`git init`
`git add .` ou `git add -A`
`git status`
`git rm --cached node_module` => retire node_module de la zone de surveillance
`git commit -m "initial commit`

##### Configuration de git

`git config --global user.email "s.coulibaly@outlook.com"`
`git config --global user.name "S-COULIBALY"`

##### Création du pont entre le depot local et Github

`git remote add origin git@github.com:S-COULIBALY/revision.git`
`git remote update` => avec update, on fetch les commits du ou des remote(s) définis
`git --remote`
`git remote -v`

##### Lors du 1er envoi, il faut lier la branche locale courante à une branche du dépôt distant

`git push --set-upstream origin master` => avec `origin` (le dépôt distant) et `master` ou `develop` (la branche distante)
`git push -u origin origin master`

##### Supprimer une branche distante

`git push origin --delete <nom_branche>`

##### Gestion des branches

`git branch <nom_branche>` => créer une nouvelle branche ET rester dans la branche courante

`git checkout <nom_branche>` => se place sur la branche indiquée

`git checkout -b <nom_branche>` => créer une nouvelle branche et se positionner dessus directement

`git branch -d <nom_branche>` => avec un warning si la branche n'a pas été pushée sur la branche distante

`git branch -D <nom_branche>` => sans warning ni vérification

- `git checkout f1529e320bb68d15aed5bb87ac625732c886709f` => se place sur le commit indiqué (marche aussi avec la version courte de l'id)

- `git checkout <nom_fichier>` => permet aussi de remettre un fichier local dans le même état que sur la branche distante

##### Git fetch (une partie)

- on peut récupérer les commits distants absents du dépôt local
- ne déplace pas le tag HEAD
  `git fetch origin`

##### Git pull (tout)

`git pull` => synchronise le repo local avec le repo distant

##### Git merge

`git merge <nom_branche>` => permet de fusionner des branches

`git merge <nom_branche> --allow-unrelated-histories` => on peut fusionner des branches venant de dépôts différents, sans historique commun

`git merge --abort` => on peut annuler un merge en cours

`git reset HEAD --hard; git clean -f -d` => on peut remettre le projet dans l'état où il était avant le commit de merge

##### Règlement automatique des conflits pour un merge d'un dépôt dont on n'est pas propriétaire

`git merge <remote>/<branch> --allow-unrelated-histories -X theirs` => appliquer toutes les modifications du repo distant

`git merge <remote>/<branch> --allow-unrelated-histories -X ours` => merge du dépôt en gardant nos modifications

`git checkout --theirs <nom_fichier>` => choisir les modifications distantes pour un fichier

`git checkout --ours <nom_fichier>` => garder nos modifications pour un fichier
