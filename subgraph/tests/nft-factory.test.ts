import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NFTContractCreated } from "../generated/schema"
import { NFTContractCreated as NFTContractCreatedEvent } from "../generated/NFTFactory/NFTFactory"
import { handleNFTContractCreated } from "../src/nft-factory"
import { createNFTContractCreatedEvent } from "./nft-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _name = "Example string value"
    let _symbol = "Example string value"
    let _baseURI = "Example string value"
    let _maxSupply = 123
    let _publicSalePrice = BigInt.fromI32(234)
    let _recipient = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newNFTContractCreatedEvent = createNFTContractCreatedEvent(
      _name,
      _symbol,
      _baseURI,
      _maxSupply,
      _publicSalePrice,
      _recipient
    )
    handleNFTContractCreated(newNFTContractCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NFTContractCreated created and stored", () => {
    assert.entityCount("NFTContractCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_name",
      "Example string value"
    )
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_symbol",
      "Example string value"
    )
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_baseURI",
      "Example string value"
    )
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_maxSupply",
      "123"
    )
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_publicSalePrice",
      "234"
    )
    assert.fieldEquals(
      "NFTContractCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_recipient",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
