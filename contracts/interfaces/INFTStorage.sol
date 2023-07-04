// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface INFTStorage {
    function setWorldgramBase(address _worldgramBase) external;
    function getAddress(bytes32 _key) external view returns (address);
    function setAddress(bytes32 _key, address _value) external;
    function deleteAddress(bytes32 _key) external;
}