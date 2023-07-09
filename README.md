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
I. Intégration des requêtes TheGraph
    B. Créer des requêtes pour interagir avec les contrats NFT déployés
        1. Identifier les données à récupérer pour chaque nouveau NFT déployé
        2. Écrire des requêtes GraphQL pour récupérer ces données

    C. Intégrer les requêtes TheGraph dans la factory de NFT et les tests unitaires
        1. Ajouter des fonctions dans la factory de NFT pour exécuter les requêtes TheGraph
        2. Mettre à jour les tests unitaires pour vérifier les interactions avec TheGraph

II. Conception de la page React avec Material-UI
    A. Créer les composants nécessaires pour afficher les résultats des interactions avec les contrats déployés
        1. Concevoir les composants pour afficher les NFT et leurs métadonnées
        2. Gérer l'état de l'application pour stocker les données récupérées

    B. Intégrer la factory de NFT et les requêtes TheGraph dans la page React
        1. Utiliser des appels API pour récupérer les données depuis la factory de NFT
        2. Afficher les résultats sur la page React en utilisant les composants de Material-UI

* navbar avec rainbow wallet et context
  - https://frontendshape.com/post/create-a-responsive-navbar-in-react-with-mui-5
  - https://javascript.works-hub.com/learn/how-to-create-a-responsive-navbar-using-material-ui-and-react-router-f9a01
  - https://mui.com/material-ui/react-app-bar/

* Une page admin avec l'ensemble des contrats créés puis acces à autre page admin avec toutes les fonctions
* Une page dashboard qui affiche les différentes collections nft

III. Tests unitaires
    A. Écrire des tests unitaires complets pour les requêtes TheGraph ?

IV. Déploiement sur un testnet
    A. Déployer les contrats sur le testnet et vérifier leur bon fonctionnement

V. Livrables
    A. Rédiger un fichier README détaillé avec des instructions pas à pas pour la configuration, l'installation des dépendances, l'exécution des tests, le lancement de la page React et l'interaction avec les contrats déployés


## INSPI
https://github.com/jxnata/factory/tree/main


## SUBGRAPH
tester de repasser à sepolia dans subgraph.yaml
Tout redeployer et retester

* tester ensuite un échange de nft entre 2 users
* plusieurs contrats de NFT, plusieurs wallets, plusieurs NFT de chaque collection par user... de la complexité
* pause et unpaused


https://thegraph.com/studio/subgraph/worldgram/playground
https://api.studio.thegraph.com/proxy/49406/worldgram/v0.0.5
https://sepolia.etherscan.io/address/0x5850619b15272eb061a22d43334c5dea6fff214c#writeContract


{
  nftcontracts(first: 5) {
    id
    address
    name
    symbol
    baseURI
    totalSupply
    maxSupply
    publicSalePrice
    recipient
    isPaused
    tokens {
      id
    }
  }
  users(first: 5) {
    address
    nftOwned {
      id
    }
  }
}