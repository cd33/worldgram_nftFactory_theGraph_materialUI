// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/// @title Worldgram NFT ERC721 collection
/// @author cd33
contract NFT721 is ERC721Upgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using StringsUpgradeable for uint256;

    address private worldgramBase;
    address private recipient;

    string public baseURI;

    uint16 public maxSupply;
    uint256 public publicSalePrice;
    uint256 public nextNFT;

    event StepChanged(uint8 step);

    constructor(address _worldgramBase) ERC721Upgradeable() {
        worldgramBase = _worldgramBase;
    }

    function initialize(
        string calldata _name,
        string calldata _symbol,
        string calldata _baseURI,
        uint16 _maxSupply,
        uint _publicSalePrice,
        address _recipient
    ) external initializer nonReentrant { // onlyfactory
        __ERC721_init(_name, _symbol);
        baseURI = _baseURI;
        maxSupply = _maxSupply;
        publicSalePrice = _publicSalePrice;
        recipient = _recipient;
    }

    modifier onlyBase() {
        require(worldgramBase == msg.sender, "Only base authorized");
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function pause() external onlyBase {
        _pause();
    }

    function unpause() external onlyBase {
        _unpause();
    }

    function setWorldgramBase(address _worldgramBase) external onlyBase {
        worldgramBase = _worldgramBase;
    }

    // function setFactory(address _factory) external onlyBase {
    //     factory = _factory;
    // }

    function setRecipient(address _newRecipient) external onlyBase {
        recipient = _newRecipient;
    }

    function setPublicSalePrice(
        uint256 _newPublicSalePrice
    ) external onlyBase {
        publicSalePrice = _newPublicSalePrice;
    }

    function setBaseUri(string memory _newBaseURI) external onlyBase {
        baseURI = _newBaseURI;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(baseURI, _tokenId.toString(), ".json")
                )
                : "";
    }

    function publicSaleMint(uint256 _quantity) external payable {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(nextNFT + _quantity <= maxSupply, "Sold out");
        require(msg.value >= _quantity * publicSalePrice, "Not enough funds");
        payable(recipient).transfer(address(this).balance);
        uint256 currentNFT = nextNFT;
        nextNFT += _quantity;
        for (uint256 i = 1; i <= _quantity; ++i) {
            _safeMint(msg.sender, currentNFT + i);
        }
    }

    function gift(address _to, uint256 _quantity) external onlyBase {
        require(_to != address(0), "Zero address");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(nextNFT + _quantity <= maxSupply, "Sold out");
        uint256 currentNFT = nextNFT;
        nextNFT += _quantity;
        for (uint256 i = 1; i <= _quantity; ++i) {
            _safeMint(_to, currentNFT + i);
        }
    }
}
