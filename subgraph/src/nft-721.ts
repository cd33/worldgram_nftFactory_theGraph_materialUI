import { Address } from "@graphprotocol/graph-ts";
import {
  Paused as PausedEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
} from "../generated/templates/NFT721/NFT721";
import { ensureNewNFTContract, nftContractId } from "./entities/NFTContract";
import { nftToken, ensureNewNFTToken } from "./entities/NFTToken";
import { ensureNewUser, userId } from "./entities/User";

export function handleTransfer(event: TransferEvent): void {
  if (
    event.params.from == Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    let contractId = nftContractId(event.address);
    let nftContract = ensureNewNFTContract(contractId);

    let usrId = userId(event.params.to);
    let user = ensureNewUser(usrId);
    user.address = event.params.to;

    let nftTokenId = nftToken(event.address, event.params.tokenId);
    let tokenNFT = ensureNewNFTToken(nftTokenId);

    tokenNFT.nftId = event.params.tokenId;
    tokenNFT.contract = nftContract.id
    tokenNFT.user = user.id;

    nftContract.totalSupply += 1;
    // let tokens = nftContract.tokens;
    // tokens.push(tokenNFT.id);
    // nftContract.tokens = tokens;

    user.save();
    tokenNFT.save();
    nftContract.save();
  } else {
    let contractId = nftContractId(event.address);
    let nftContract = ensureNewNFTContract(contractId);

    let usrId1 = userId(event.params.from);
    let user1 = ensureNewUser(usrId1);
    user1.address = event.params.from;
    let usrId2 = userId(event.params.to);
    let user2 = ensureNewUser(usrId2);
    user2.address = event.params.to;

    let nftTokenId = nftToken(event.address, event.params.tokenId);
    let tokenNFT = ensureNewNFTToken(nftTokenId);
    tokenNFT.nftId = event.params.tokenId;
    tokenNFT.contract = nftContract.id
    tokenNFT.user = user2.id;

    user1.save();
    user2.save();
    tokenNFT.save();
    nftContract.save()
  }
}

export function handlePaused(event: PausedEvent): void {
  let contractId = nftContractId(event.address);
  let nftContract = ensureNewNFTContract(contractId);

  nftContract.isPaused = true;

  nftContract.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let contractId = nftContractId(event.address);
  let nftContract = ensureNewNFTContract(contractId);

  nftContract.isPaused = false;

  nftContract.save();
}

// export function handleInitialized(event: InitializedEvent): void {
//   let entity = new Initialized(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.version = event.params.version

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
