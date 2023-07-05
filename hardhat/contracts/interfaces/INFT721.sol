// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface INFT721 {
    function initialize(
        string calldata _name,
        string calldata _symbol,
        string calldata _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient,
        address _worldgramBase
    ) external;
    function pause() external;
    function unpause() external;
    function setWorldgramBase(address _worldgramBase) external;
    function setRecipient(address _newRecipient) external;
    function setPublicSalePrice(uint256 _newPublicSalePrice) external;
    function setBaseUri(string memory _newBaseURI) external;
    function gift(address _to, uint256 _quantity) external;
}
