import { NFT721 as NFT721Template } from "../generated/templates";
import { NFTContractCreated as NFTContractCreatedEvent } from "../generated/NFTFactory/NFTFactory";
import { ensureNewNFTContract, nftContractId } from "./entities/NFTContract";

export function handleNFTContractCreated(event: NFTContractCreatedEvent): void {
  // let factory: NFTFactory = ensureNewNFTContract("0");
  // if (factory == null) {
  //   factory = new NFTFactory("0");
  //   factory.address = event.address
  //   factory.totalSupply = 0;
  //   // factory.nftContracts = [];
  //   factory.save();
  // }
  // let contractId = factory.totalSupply + 1

  let id = nftContractId(event.params.nftContractAddress);
  let nftContract = ensureNewNFTContract(id);
  nftContract.address = event.params.nftContractAddress;
  nftContract.name = event.params.name;
  nftContract.symbol = event.params.symbol;
  nftContract.baseURI = event.params.baseURI;
  nftContract.totalSupply = 0;
  nftContract.maxSupply = event.params.maxSupply;
  nftContract.publicSalePrice = event.params.publicSalePrice;
  nftContract.recipient = event.params.recipient;
  nftContract.isPaused = false;
  nftContract.save();

  NFT721Template.create(event.params.nftContractAddress); //new template instance
}
