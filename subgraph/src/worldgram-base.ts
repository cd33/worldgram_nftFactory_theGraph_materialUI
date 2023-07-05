import {
  NFTAdded as NFTAddedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/WorldgramBase/WorldgramBase"
import { NFTAdded, OwnershipTransferred } from "../generated/schema"

export function handleNFTAdded(event: NFTAddedEvent): void {
  let entity = new NFTAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._nftId = event.params._nftId
  entity._nftAddress = event.params._nftAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
