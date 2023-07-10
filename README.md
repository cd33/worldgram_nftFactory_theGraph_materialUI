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
I. Conception de la page React avec Material-UI
  A. navbar avec rainbow wallet et context
    - https://frontendshape.com/post/create-a-responsive-navbar-in-react-with-mui-5
    - https://javascript.works-hub.com/learn/how-to-create-a-responsive-navbar-using-material-ui-and-react-router-f9a01
    - https://mui.com/material-ui/react-app-bar/

  B. Une page dashboard qui affiche les différentes collections nft
    1. Utiliser des appels API pour récupérer les données depuis la factory de NFT
    2. Afficher les résultats sur la page React en utilisant les composants de Material-UI

  C. Page admin avec l'ensemble des contrats créés puis acces à autre page admin avec toutes les fonctions

  D. Tester le tout en local hardhat

II. Redéploiement
    A. Déployer les contrats sur le testnet
    B. Déployer et cabler le subgraph v6
    C. Changer les variables contrats coté front
    D. Tester le tout

III. Livrables
    A. Rédiger un fichier README détaillé avec des instructions pas à pas pour la configuration, l'installation des dépendances, l'exécution des tests, le lancement de la page React et l'interaction avec les contrats déployés

Facultatif: Écrire des tests unitaires complets pour les requêtes TheGraph

## INSPI
https://github.com/jxnata/factory/tree/main


## SUBGRAPH
tester de repasser à sepolia dans subgraph.yaml
Tout redeployer et retester

https://thegraph.com/studio/subgraph/worldgram/playground
https://api.studio.thegraph.com/proxy/49406/worldgram/v0.0.5
https://sepolia.etherscan.io/address/0x5850619b15272eb061a22d43334c5dea6fff214c#writeContract


{
  nftcontracts(first: 5) {
    id  
    name
    totalSupply
    isPaused
    tokens {
      id
    }
  }
  users(first: 5) {
    id
    nftOwned {
      id
    }
  }
}