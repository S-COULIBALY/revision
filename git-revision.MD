[Recap git](https://github.com/O-clock-Uther/playlist-blue) (lien vers la fiche récap du prof Nicolas charpin)

##### Cycle de versionning

`git init` <br>
`git add .` ou `git add -A`<br>
`git rm --cached <nom-du-fichier>` => retire les fichier en question de la zone de surveillance avant le commit<br>

`git restore <file>` => pour annuler les modifications dans le répertoire de travail<br>
`git restore --staged <file>` => met notre branche est à jour avec ce qui est sur "origin/master (un retour en arrière sur l'ancien commit)<br>

`git status`

`git restore --staged <file>` => rétirer de la zone de surveillance<br>
`git commit -m "initial commit`<br>
`git commit -a "initial commit` => fait le `add` er le `commit` en même temps<br>

`git commit --amend -m "an updated commit message"` => pour modifier le message de commit sans changer son instantané<br>

`git log` => liste tous commit<br>
ou<br>
`git log --graph --oneline --all` => liste tous commit<br>

##### Configuration de git

`git config --global user.email "s.coulibaly@outlook.com"`<br>
`git config --global user.name "S-COULIBALY"`<br>

##### Création du pont entre le depot local et Github

`git remote add origin git@github.com:S-COULIBALY/revision.git`<br>
`git remote update` => avec update, on fetch les commits du ou des remote(s) définis<br>
`git --remote`<br>
`git remote -v`<br>

##### Lors du 1er envoi, il faut lier la branche locale courante à une branche du dépôt distant

`git push --set-upstream origin master` => avec `origin` (le dépôt distant) et `master` ou `develop` (la branche distante)<br>
`git push -u origin origin master`<br>

##### Supprimer une branche distante

`git push origin --delete <nom_branche>`<br>

##### Gestion des branches

`git branch <nom_branche>` => créer une nouvelle branche ET rester dans la branche courante<br>

`git checkout <nom_branche>` => se place sur la branche indiquée

`git checkout -b <nom_branche>` => créer une nouvelle branche et se positionner dessus directement

`git branch -d <nom_branche>` => avec un warning si la branche n'a pas été pushée sur la branche distante

`git branch -D <nom_branche>` => sans warning ni vérification

- `git checkout f1529e320bb68d15aed5bb87ac625732c886709f` => se place sur le commit indiqué (marche aussi avec la version courte de l'id)

- `git checkout <nom_fichier>` => permet aussi de remettre un fichier local dans le même état que sur la branche distante

##### Git fetch + merge + commit (la difference / en opposition avec git clone où on réccupère tout d'un nouveau repo distant SANS deplace le HEAD)

- on peut récupérer les commits distants absents du dépôt local
- ne déplace pas le tag HEAD
  `git fetch origin`

##### Git pull + commit (c'est le fetch + merge et deplace le HEAD)

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
