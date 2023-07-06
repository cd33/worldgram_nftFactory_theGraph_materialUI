import { Address } from "@graphprotocol/graph-ts";
import { NFTContract } from "../../generated/schema";

export function nftContractId(nftContractAddress: Address): string {
  return "NFTContract".concat(nftContractAddress.toHexString());
}

export function ensureNewNFTContract(id: string): NFTContract {
  //It is the entity ID not the questionId
  let nftContract = NFTContract.load(id);

  if (nftContract) {
    return nftContract;
  } else {
    nftContract = new NFTContract(id);

    nftContract.save();

    return nftContract;
  }
}
