### Micro service de fidélité.
## Lancer le server:
``` bash
> npm install
> gulp serve
```

## A faire
Développer un micro service de fidélité.
En utilisant express et une base de donnée mongo.


Etape 1: Un utilisateur a des points de fidélité.
- Lorsque l'utilsateur dépense de l'argent sur la plateforme il gagne autant de points (1 euro dépensé = 1 point).
- Il peut connaitre son nombre de points.

Etape 2: Ajout du statut.
- Le status (novice, silver, gold, platinum) d'un utilisateur est determiné en fonction de son nombre de course.
- Ajouter à la route pour dépenser de l'argent le fait de faire une course ou non.
- L'utilisateur peut connaitre son status (bonus: son nombre de course et le nombre de course à faire pour obtenir le prochain status).

Etape 3: Gain de points en fonction du status
- Le nombre de points gagné dépend du status de l'utilsateur:
  - novice: 1 euro dépensé = 1 point
  - silver: 1 euro dépensé = 1 point
  - gold: 1 euro dépensé = 2 points
  - platinum: 1 euro dépensé = 3 points
&
