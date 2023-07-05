import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { NFTContractCreated } from "../generated/NFTFactory/NFTFactory"

export function createNFTContractCreatedEvent(
  _name: string,
  _symbol: string,
  _baseURI: string,
  _maxSupply: i32,
  _publicSalePrice: BigInt,
  _recipient: Address
): NFTContractCreated {
  let nftContractCreatedEvent = changetype<NFTContractCreated>(newMockEvent())

  nftContractCreatedEvent.parameters = new Array()

  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam("_name", ethereum.Value.fromString(_name))
  )
  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam("_symbol", ethereum.Value.fromString(_symbol))
  )
  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam("_baseURI", ethereum.Value.fromString(_baseURI))
  )
  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_maxSupply",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_maxSupply))
    )
  )
  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_publicSalePrice",
      ethereum.Value.fromUnsignedBigInt(_publicSalePrice)
    )
  )
  nftContractCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_recipient",
      ethereum.Value.fromAddress(_recipient)
    )
  )

  return nftContractCreatedEvent
}
