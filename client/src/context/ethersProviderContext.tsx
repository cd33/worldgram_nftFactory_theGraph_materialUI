import { createContext } from "react";
import { ReactElement } from "react";

type Context = {
  worldgramBase: string;
  nftStorage: string;
  nft721: string;
  nftFactory: string;
  owner: string;
};

const initialContext: Context = {
  worldgramBase: "",
  nftStorage: "",
  nft721: "",
  nftFactory: "",
  owner: "",
};

export const EthersContext = createContext(initialContext);

export const EthersProvider = (props: { children: ReactElement }) => {
  const worldgramBase = "0xFDCcE9b656a7a8dDcDa8aDd0B978C1991690d2E4";
  const nftStorage = "0xD9C239AaF1681e0819d3F7FEf929Cfef92034A91";
  const nft721 = "0x33801fECd9181Aaabb85e007e4607a86088a5117";
  const nftFactory = "0xdE8860F8E20ce1445f7bF31927dD16888bB02e90";
  const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  return (
    <EthersContext.Provider
      value={{
        worldgramBase,
        nftStorage,
        nft721,
        nftFactory,
        owner,
      }}
    >
      {props.children}
    </EthersContext.Provider>
  );
};

export default EthersContext;
