import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Approval } from "../generated/templates/NFT721/NFT721";
import { Approval as ApprovalEvent } from "../generated/templates/NFT721/NFT721";
import { handleTransfer } from "../src/nft-721";
import { createTransferEvent } from "./nft-721-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let from = Address.fromString("0x0000000000000000000000000000000000000000");
    let to = Address.fromString("0x0411A12466cd4B1BBF6dD6F18C3aa1bDcF33Bcc1");
    let tokenId = BigInt.fromI32(234);
    let newApprovalEvent = createTransferEvent(from, to, tokenId);
    handleTransfer(newApprovalEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Approval created and stored", () => {
    assert.entityCount("Approval", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "approved",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
