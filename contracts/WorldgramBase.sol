// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./NFT721.sol";
import "./interfaces/INFTFactory.sol";
import "./interfaces/INFTStorage.sol";
import "./interfaces/INFT721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title Worldgram Base
/// @author cd33
contract WorldgramBase is Ownable {
    INFTStorage public nftStorage;
    INFTFactory public nftFactory;

    uint256 private nextId;

    event NFTAdded(uint _nftId, address _nftAddress);

    function setNFTStorage(address _nftStorage) external onlyOwner {
        nftStorage = INFTStorage(_nftStorage);
    }

    function setNFTFactory(address _nftFactory) external onlyOwner {
        nftFactory = INFTFactory(_nftFactory);
    }

    function setNFT(
        uint _id,
        address _addressContract
    ) private {
        nftStorage.setAddress(
            keccak256(abi.encodePacked("nft.addressContract", _id)),
            _addressContract
        );
    }

    function storeNFT(
        address _addressContract
    ) private {
        nextId++;
        setNFT(nextId, _addressContract);
    }

    function getNFTAddress(uint _nftId) external view returns (address) {
        return nftStorage.getAddress(
            keccak256(abi.encodePacked("nft.addressContract", _nftId))
        );
    }

    function newNFT(
        string calldata _name,
        string calldata _symbol,
        string calldata _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient
    ) external onlyOwner {
        address nftAddress = nftFactory.createNFT(
            _name,
            _symbol,
            _baseURI,
            _maxSupply,
            _publicSalePrice,
            _recipient
        );
        storeNFT(nftAddress);
        emit NFTAdded(nextId, nftAddress);
    }

    // *** ADMIN ***
    // STORAGE
    function setWorldgramBaseSTORAGE(address _worldgramBase) external onlyOwner {
        nftStorage.setWorldgramBase(_worldgramBase);
    }
    function setAddressSTORAGE(bytes32 _key, address _value) external onlyOwner {
        nftStorage.setAddress(_key, _value);
    }
    function deleteAddressSTORAGE(bytes32 _key) external onlyOwner {
        nftStorage.deleteAddress(_key);
    }

    // NFTFACTORY
    function setWorldgramBaseNFTFACTORY(address _worldgramBase) external onlyOwner {
        nftFactory.setWorldgramBase(_worldgramBase);
    }
    function setNFTImplementationNFTFACTORY(address _nftImplementation) external onlyOwner {
        nftFactory.setNFTImplementation(_nftImplementation);
    }

    // NFT721
    function pause(address _nftContract) external onlyOwner {
        INFT721(_nftContract).pause();
    }
    function unpause(address _nftContract) external onlyOwner {
        INFT721(_nftContract).unpause();
    }
    function setWorldgramBaseNFT721(address _nftContract, address _worldgramBase) external onlyOwner {
        INFT721(_nftContract).setWorldgramBase(_worldgramBase);
    }
    function setRecipient(address _nftContract, address _newRecipient) external onlyOwner {
        INFT721(_nftContract).setRecipient(_newRecipient);
    }
    function setPublicSalePrice(address _nftContract, uint256 _newPublicSalePrice) external onlyOwner {
        INFT721(_nftContract).setPublicSalePrice(_newPublicSalePrice);
    }
    function setBaseUri(address _nftContract, string memory _newBaseURI) external onlyOwner {
        INFT721(_nftContract).setBaseUri(_newBaseURI);
    }
    function gift(address _nftContract, address _to, uint256 _quantity) external onlyOwner {
        INFT721(_nftContract).gift(_to, _quantity);
    }
}