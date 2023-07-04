# worldgram
## EXERCICE
Nous vous invitons à mettre en pratique vos compétences et votre expertise pour une fonctionnalité clé de notre projet actuel, où nous cherchons à développer NFT Factory en utilisant le framework Hardhat.
Voici vos tâches principales :
### NFT Factory
Développer une factory de NFT avec la capacité de déployer des contrats NFT individuels en utilisant le framework Hardhat. Une interface web pour la création de NFT n'est pas nécessaire; une simple tâche Hardhat suffira.

### Requêtes TheGraph
Une fois que chaque contrat NFT est déployé, nous avons besoin de la fonctionnalité pour interagir avec et récupérer les données de chaque nouveau NFT. Cela peut être réalisé en créant et en exécutant des requêtes à travers TheGraph.

### Page React avec Material-UI
Concevoir une page React minimaliste en utilisant Material-UI pour présenter les résultats des interactions avec les contrats déployés.

### Tests unitaires
Rédiger des tests unitaires complets pour affirmer la fonctionnalité et la fiabilité des contrats.

### Déploiement sur un testnet
Vous pouvez choisir n'importe quel testnet pour le déploiement des contrats ; vos options incluent Sepolia, Goerli et Mumbai.

### Livrables
* Dépôt GitHub : Téléchargez votre code finalisé sur un dépôt GitHub public. Cela facilitera le processus d'examen et ouvrira des possibilités de collaboration future.
* Fichier README : offrant des instructions détaillées, étape par étape, pour les procédures de configuration, les installations de dépendances, l'exécution des tests, le lancement de la page React et l'interaction avec les contrats déployés.

*********************************************************************************

## PLAN
II. Développement de la factory de NFT
    C. Écrire des tests unitaires pour vérifier la fonctionnalité de la factory de NFT
       - base (chaque fonctions non faites dans les autres tests et revert onlyOnwer)

III. Intégration des requêtes TheGraph
    A. Comprendre le fonctionnement de TheGraph et configurer un sous-graphe
        1. Explorer la documentation de TheGraph pour comprendre les concepts clés
        2. Configurer un sous-graphe pour votre usine de NFT sur TheGraph

    B. Créer des requêtes pour interagir avec les contrats NFT déployés
        1. Identifier les données à récupérer pour chaque nouveau NFT déployé
        2. Écrire des requêtes GraphQL pour récupérer ces données

    C. Intégrer les requêtes TheGraph dans l'usine de NFT et les tests unitaires
        1. Ajouter des fonctions dans l'usine de NFT pour exécuter les requêtes TheGraph
        2. Mettre à jour les tests unitaires pour vérifier les interactions avec TheGraph

IV. Conception de la page React avec Material-UI
    A. Mettre en place un projet React avec Material-UI
        1. Initialiser un nouveau projet React
        2. Installer les dépendances nécessaires de Material-UI
        3. Créer la structure de base de l'application React

    B. Créer les composants nécessaires pour afficher les résultats des interactions avec les contrats déployés
        1. Concevoir les composants pour afficher les NFT et leurs métadonnées
        2. Gérer l'état de l'application pour stocker les données récupérées

    C. Intégrer l'usine de NFT et les requêtes TheGraph dans la page React
        1. Utiliser des appels API pour récupérer les données depuis l'usine de NFT
        2. Afficher les résultats sur la page React en utilisant les composants de Material-UI

V. Tests unitaires
    A. Écrire des tests unitaires complets pour les contrats NFT, la factory de NFT et les requêtes TheGraph
    B. S'assurer que tous les tests passent avec succès

VI. Déploiement sur un testnet
    A. Sélectionner un testnet (Sepolia, Goerli, ou Mumbai) pour le déploiement des contrats
    B. Configurer les paramètres de déploiement pour le testnet choisi
    C. Déployer les contrats sur le testnet et vérifier leur bon fonctionnement

VII. Livrables
    A. Créer un dépôt public sur GitHub et télécharger le code finalisé
    B. Rédiger un fichier README détaillé avec des instructions pas à pas pour la configuration, l'installation des dépendances, l'exécution des tests, le lancement de la page React et l'interaction avec les contrats déployés

VIII. Révision et collaboration
    A. Permettre aux collègues ou aux relecteurs de passer en revue le code sur GitHub
    B. Prendre en compte les commentaires et les suggestions pour améliorer le code et la documentation


## INSPI
https://github.com/jxnata/factory/tree/main
