// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface INFTStorage {
    function setWorldgramBase(address _worldgramBase) external;
    function getAddressNFT(bytes32 _key) external view returns (address);
    function setAddressNFT(bytes32 _key, address _value) external;
    function deleteAddressNFT(bytes32 _key) external;
}