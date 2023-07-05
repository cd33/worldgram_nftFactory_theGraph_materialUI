import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NFTAdded,
  OwnershipTransferred
} from "../generated/WorldgramBase/WorldgramBase"

export function createNFTAddedEvent(
  _nftId: BigInt,
  _nftAddress: Address
): NFTAdded {
  let nftAddedEvent = changetype<NFTAdded>(newMockEvent())

  nftAddedEvent.parameters = new Array()

  nftAddedEvent.parameters.push(
    new ethereum.EventParam("_nftId", ethereum.Value.fromUnsignedBigInt(_nftId))
  )
  nftAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_nftAddress",
      ethereum.Value.fromAddress(_nftAddress)
    )
  )

  return nftAddedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
