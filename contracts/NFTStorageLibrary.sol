// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "./NFTStorage.sol";

/// @title Worldgram NFT Storage Library
/// @author cd33
library NFTStorageLibrary {
    function setNFT(
        address _storage,
        uint _id,
        address _addressContract
    ) internal {
        NFTStorage(_storage).setAddress(
            keccak256(abi.encodePacked("nft.addressContract", _id)),
            _addressContract
        );
    }

    function getNFT(
        address _storage,
        uint _id
    ) internal view returns (address) {
        address addressContract = NFTStorage(_storage).getAddress(
            keccak256(abi.encodePacked("nft.addressContract", _id))
        );
        return addressContract;
    }
}