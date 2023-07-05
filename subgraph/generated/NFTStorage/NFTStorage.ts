// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class NFTStorage extends ethereum.SmartContract {
  static bind(address: Address): NFTStorage {
    return new NFTStorage("NFTStorage", address);
  }

  getAddressNFT(_key: Bytes): Address {
    let result = super.call(
      "getAddressNFT",
      "getAddressNFT(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(_key)]
    );

    return result[0].toAddress();
  }

  try_getAddressNFT(_key: Bytes): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getAddressNFT",
      "getAddressNFT(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(_key)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  worldgramBase(): Address {
    let result = super.call("worldgramBase", "worldgramBase():(address)", []);

    return result[0].toAddress();
  }

  try_worldgramBase(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "worldgramBase",
      "worldgramBase():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _worldgramBase(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DeleteAddressNFTCall extends ethereum.Call {
  get inputs(): DeleteAddressNFTCall__Inputs {
    return new DeleteAddressNFTCall__Inputs(this);
  }

  get outputs(): DeleteAddressNFTCall__Outputs {
    return new DeleteAddressNFTCall__Outputs(this);
  }
}

export class DeleteAddressNFTCall__Inputs {
  _call: DeleteAddressNFTCall;

  constructor(call: DeleteAddressNFTCall) {
    this._call = call;
  }

  get _key(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class DeleteAddressNFTCall__Outputs {
  _call: DeleteAddressNFTCall;

  constructor(call: DeleteAddressNFTCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetAddressNFTCall extends ethereum.Call {
  get inputs(): SetAddressNFTCall__Inputs {
    return new SetAddressNFTCall__Inputs(this);
  }

  get outputs(): SetAddressNFTCall__Outputs {
    return new SetAddressNFTCall__Outputs(this);
  }
}

export class SetAddressNFTCall__Inputs {
  _call: SetAddressNFTCall;

  constructor(call: SetAddressNFTCall) {
    this._call = call;
  }

  get _key(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _value(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class SetAddressNFTCall__Outputs {
  _call: SetAddressNFTCall;

  constructor(call: SetAddressNFTCall) {
    this._call = call;
  }
}

export class SetWorldgramBaseCall extends ethereum.Call {
  get inputs(): SetWorldgramBaseCall__Inputs {
    return new SetWorldgramBaseCall__Inputs(this);
  }

  get outputs(): SetWorldgramBaseCall__Outputs {
    return new SetWorldgramBaseCall__Outputs(this);
  }
}

export class SetWorldgramBaseCall__Inputs {
  _call: SetWorldgramBaseCall;

  constructor(call: SetWorldgramBaseCall) {
    this._call = call;
  }

  get _worldgramBase(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetWorldgramBaseCall__Outputs {
  _call: SetWorldgramBaseCall;

  constructor(call: SetWorldgramBaseCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
