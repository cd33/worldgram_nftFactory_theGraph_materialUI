# worldgram
## ASSIGNMENT
We invite you to apply your skills and expertise to a key feature in our current project, where we aim to develop an NFT (Non-Fungible Token) factory utilizing the Hardhat framework.  
Here are your primary tasks:
### NFT Factory
Develop an NFT factory with the ability to deploy individual NFT contracts using the Hardhat framework. A web interface for NFT minting is not necessary; a simple Hardhat task will suffice.

### TheGraph Queries
Once each NFT contract is deployed, we need the functionality to interact with and retrieve data for each new NFT. This can be achieved by creating and executing queries through TheGraph.

### React Page with Material-UI
Craft a minimalist React page using Material-UI to showcase the results of the interactions with the deployed contracts.

### Unit Testing
Write comprehensive unit tests to affirm the functionality and reliability of the contracts.

### Testnet Deployment
Feel free to select any testnet for contract deployment; your options include Sepolia, Goerli, and Mumbai.

### Deliverables
* GitHub Repository: Upload your finalized code to a public GitHub repository. This will facilitate an efficient review process and open possibilities for future collaboration.
* Fichier README : Your GitHub repository should contain a README file offering detailed, step-by-step instructions for setup procedures, dependency installations, test execution, launching the React page, and interacting with the deployed contracts.

## Prerequisites
Before getting started, ensure that you have the following installed
* Node.js
* Yarn package manager
* Hardhat
* Metamask browser extension
* Docker (if you want to test subgraph locally)

## Installation
If you simply want to test the project, you can go to https://worldgram-nft-factory-the-graph-material-ui.vercel.app/

If you want to deploy the whole thing locally, follow these instructions
* In each sub-folder (client, hardhat and subgraph)
```
yarn install
```
* Create .env in ./client
```
VITE_GRAPH_QL_API=https://api.studio.thegraph.com/query/49406/worldgram/v0.1.0 (or in local: http://127.0.0.1:8000/subgraphs/name/worldgram)
VITE_PROJECT_ID=XXX
```
* Create .env in ./hardhat
```
SEPOLIA_TESTNET_ALCHEMY="XXX"
PRIVATE_KEY_TEST="XXX"
ETHERSCAN="XXX"
```
* Change the XXX to your own values

## Deploying NFT Contracts
To deploy NFT contracts, follow these steps in ./hardhat
* Update the hardhat.config.js file with your desired network configuration and deployment settings.
* Run the deployment script:
```
npx hardhat run scripts/deploy.js --network <network-name>
```
* Replace <network-name> with the desired network (e.g., sepolia, goerli, mumbai).
The script will deploy the NFT contracts and provide the contract addresses.

## Unit Testing
To run the unit tests, in ./hardhat, use the following command
```
npx hardhat test
```
The tests will verify the functionality and reliability of the NFT contracts.

## Running the React Page
To run the React page locally, follow these steps in ./client
```
yarn dev
```
Open your browser and visit http://localhost:5173 to access the React page.

## Test subgraph locally:
* Download the repo 
```
git clone https://github.com/graphprotocol/graph-node/
```

* Launch a hardhat node in the hardhat folder:
```
yarn hardhat node --hostname 0.0.0.0
```

* Launch Docker and in the downloaded folder ./graph-node/docker
```
docker-compose up
```

* On your terminal with the hardhat node, wait for the blocks to unroll

* In the ./subgraph folder
```
yarn run create-local
```

* Deploy the contracts on the node and create interactions in ./hardhat
```
yarn hardhat --network localhost run scripts/deploy.ts
yarn hardhat --network localhost run .\scripts\subgraph_createBuy.ts
yarn hardhat --network localhost run .\scripts\subgraph_transferPause.ts
```

* Deploy the subgraph in ./subgraph:
```
yarn run deploy-local
```

* Change the variables with contrats deployed addresses in ./client/src/context/ethersProviderContext.tsx and VITE_GRAPH_QL_API in ./client/.env

* Finally, launch the client, in ./client
```
yarn dev
```

## Testing interactions with thegraph
Go to the [local deployer site](http://127.0.0.1:8000/subgraphs/name/worldgram) or [the project's subgraph](https://api.studio.thegraph.com/query/49406/worldgram/version/latest) and enter for example
```
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
```

## Possible improvements
* Use ipfs for images, and display them on the front end
* Write full unit tests for TheGraph requests