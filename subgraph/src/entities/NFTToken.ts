import { Address } from "@graphprotocol/graph-ts";
import { NFTToken } from "../../generated/schema";

export function nftToken(
  nftTokenAddress: Address,
  userAddress: Address
): string {
  return "NFTToken"
    .concat(nftTokenAddress.toHexString())
    .concat(userAddress.toHexString());
}

export function ensureNewNFTToken(id: string): NFTToken {
  //It is the entity ID not the questionId
  let nftToken = NFTToken.load(id);

  if (nftToken) {
    return nftToken;
  } else {
    nftToken = new NFTToken(id);
    nftToken.save();
    return nftToken;
  }
}
