// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class NFT721 extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("NFT721", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("NFT721", [address.toHex()], context);
  }
}
