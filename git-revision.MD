[Recap git](https://github.com/O-clock-Uther/playlist-blue) (lien vers la fiche récap du prof Nicolas charpin)

##### Cycle de versionning

- `git init` <br>
  -- on commence à modifier les fichiers du projet<br>
  -- changement 1<br>
  -- changement 2 <br>
  --changement ....<br>
  -- et <br>

- Vérifier 1ère fois l'état du projet et si problème revenir en arrière en annulant les modification de la `zone de travail`<br>
  `git status`<br>
  `git restore <file>` => pour annuler les modifications dans le répertoire de travail(working directory) avant le `add du stage`<br>

- Ajouter les modifications à la zone et si problème revenir en arrière en annulant les modification de la `zone de stage`<br>
  `git add .` ou `git add -A`<br>
  `git status`<br>
  `git restore --staged <file>` => désindexe les changements de la zone de stage<br>
  `git rm --cached <nom-du-fichier>` => retire le fichier en indexer de la zone de surveillance avant le commit<br>

- Faire un commit<br>
  `git commit -m "initial commit`<br>
  `git commit -a -m "initial commit` => fait le `add` er le `commit` en même temps<br>
  `git commit --amend -m "an updated commit message"` => pour modifier le message de commit sans changer son instantané<br>

- Lister tous commit<br>
  `git log`<br>
  ou<br>
  `git log --graph --oneline --all` => liste tous commit de manière pretty<br>

- Lister la différence entre les commits
  `git diff`<br>

##### Configuration de git

- Définir les informations utiles à git au niveau du système (user.name, user.email)<br>
  `git config --global user.email "s.coulibaly@outlook.com"`<br>
  `git config --global user.name "S-COULIBALY"`<br>

- on peut s'en servir pour définir des raccourcis de commandes<br>
  `git config --global alias.<nom_raccourci> <commande> [options]` 'sans le mot git'<br>
  `git config --global alias.tree 'log --graph --oneline --all'`<br>

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
`git checkout <nom_branche>` => se place sur la branche indiquée<br>
`git checkout -b <nom_branche>` => créer une nouvelle branche et se positionner dessus directement<br>
`git branch -d <nom_branche>` => avec un warning si la branche n'a pas été pushée sur la branche distante<br>
`git branch -D <nom_branche>` => sans warning ni vérification<br>

- `git checkout f1529e320bb68d15a` => se place sur le commit indiqué (marche aussi avec la version courte de l'id)<br>
- `git checkout <nom_fichier>` => permet aussi de remettre un fichier local dans le même état que sur la branche distante<br>

##### Git fetch (ne deplace pas le HEAD)

- Récupère les commits distants absents du dépôt local / en opposition avec `git clone` qui réccupère tout d'un repo distant<br>
  `git fetch origin` => Il faut ensuite merge + commit<br>

##### Git pull (deplace le HEAD)

- pull = fecth + merge => il faut ensuite commit<br>
  `git pull` => synchronise le repertoire de travail avec le repo distant et deplace le HEAD<br>

##### Git merge

`git merge <nom_branche>` => permet de fusionner des branches<br>
`git merge <nom_branche> --allow-unrelated-histories` => on peut fusionner des branches venant de dépôts différents, sans historique commun<br>
`git merge --abort` => on peut annuler un merge en cours<br>
`git reset HEAD --hard; git clean -f -d` => on peut remettre le projet dans l'état où il était avant le commit de merge<br>

##### Règlement automatique des conflits pour un merge d'un dépôt dont on n'est pas propriétaire

`git merge <remote>/<branch> --allow-unrelated-histories -X theirs` => appliquer toutes les modifications du repo distant<br>
`git merge <remote>/<branch> --allow-unrelated-histories -X ours` => merge du dépôt en gardant nos modifications<br>
`git checkout --theirs <nom_fichier>` => choisir les modifications distantes pour un fichier<br>
`git checkout --ours <nom_fichier>` => garder nos modifications pour un fichier<br>
