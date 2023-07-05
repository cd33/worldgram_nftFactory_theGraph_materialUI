import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NFTAdded } from "../generated/schema"
import { NFTAdded as NFTAddedEvent } from "../generated/WorldgramBase/WorldgramBase"
import { handleNFTAdded } from "../src/worldgram-base"
import { createNFTAddedEvent } from "./worldgram-base-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _nftId = BigInt.fromI32(234)
    let _nftAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newNFTAddedEvent = createNFTAddedEvent(_nftId, _nftAddress)
    handleNFTAdded(newNFTAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NFTAdded created and stored", () => {
    assert.entityCount("NFTAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NFTAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_nftId",
      "234"
    )
    assert.fieldEquals(
      "NFTAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_nftAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
