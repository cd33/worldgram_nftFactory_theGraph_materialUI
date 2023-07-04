// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./NFT721.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";

/// @title Worldgram NFT Factory
/// @author cd33
contract NFTFactory {
    address worldgramBase;
    address nftImplementation;

    event NFTContractCreated(
        string _name,
        string _symbol,
        string _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient
    );

    constructor(address _worldgramBase, address _nftImplementation) {
        worldgramBase = _worldgramBase;
        nftImplementation = _nftImplementation;
    }

    modifier onlyBase() {
        require(worldgramBase == msg.sender, "Only base authorized");
        _;
    }

    function setWorldgramBase(address _worldgramBase) external onlyBase {
        worldgramBase = _worldgramBase;
    }

    function setNFTImplementation(address _nftImplementation) external onlyBase {
        nftImplementation = _nftImplementation;
    }

    function createNFT(
        string calldata _name,
        string calldata _symbol,
        string calldata _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient
    ) public onlyBase returns(address) {
        address clone = Clones.clone(nftImplementation);
        NFT721(clone).initialize(_name, _symbol, _baseURI, _maxSupply, _publicSalePrice, _recipient);
        emit NFTContractCreated(_name, _symbol, _baseURI, _maxSupply, _publicSalePrice, _recipient);
        return clone;
    }
}