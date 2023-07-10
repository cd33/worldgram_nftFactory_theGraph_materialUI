export const FIRST5_QUESTIONS = {
  query: `{
    nftcontracts(first: 5) {
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
