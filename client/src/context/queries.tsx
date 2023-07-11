export const NFT_CONTRACTS = {
  query: `{
    nftcontracts {
      id
      address
      name
      totalSupply
      isPaused
      tokens {
        id
      }
    }
  }`,
};

export const getNftContractByAddress = (contractAddress: any) => ({
  query: `query ($address: Bytes) {
    nftcontracts(where: {address: $address}) {
      name
      totalSupply
      maxSupply
      isPaused
      publicSalePrice
    }
  }`,
  variables: {
    address: contractAddress,
  },
});

export const getUserResponsesQuery = (userAddress: any) => ({
  query: `query ($address: Bytes) {
    users(where: {address: $address}) {
      nftOwned {
        id
        nftId
        contract {
          name
          address
        }
      }
    }
  }`,
  variables: {
    address: userAddress,
  },
});
