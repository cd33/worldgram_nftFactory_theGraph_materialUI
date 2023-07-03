// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Worldgram NFT Storage
/// @author cd33
contract NFTStorage is Ownable {
    address public worldgramBase;

    mapping(bytes32 => bool) private boolStorage;
    mapping(bytes32 => address) private addressStorage;

    modifier onlyBase() {
        require(worldgramBase == msg.sender, "Only base authorized");
        _;
    }

    function setWorldgramBase(address _worldgramBase) external onlyBase {
        worldgramBase = _worldgramBase;
    }

    function getAddress(bytes32 _key) external view returns (address) {
        return addressStorage[_key];
    }

    function setAddress(bytes32 _key, address _value) external onlyBase {
        addressStorage[_key] = _value;
    }

    function deleteAddress(bytes32 _key) external onlyBase {
        delete addressStorage[_key];
    }
}