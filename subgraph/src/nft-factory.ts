import { NFTContractCreated as NFTContractCreatedEvent } from "../generated/NFTFactory/NFTFactory"
import { NFTContractCreated } from "../generated/schema"

export function handleNFTContractCreated(event: NFTContractCreatedEvent): void {
  let entity = new NFTContractCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._name = event.params._name
  entity._symbol = event.params._symbol
  entity._baseURI = event.params._baseURI
  entity._maxSupply = event.params._maxSupply
  entity._publicSalePrice = event.params._publicSalePrice
  entity._recipient = event.params._recipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
