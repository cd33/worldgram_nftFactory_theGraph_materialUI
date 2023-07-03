// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface INFTFactory {
    function setWorldgramBase(address _worldgramBase) external;
    function setNFTImplementation(address _nftImplementation) external;
    function createNFT(
        string calldata _name,
        string calldata _symbol,
        string calldata _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient
    ) external returns (address);
}
