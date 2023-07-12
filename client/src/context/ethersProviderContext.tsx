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
  const worldgramBase = "0xb510F5bEb8E217F8c22562A795B002c691cE7333";
  const nftStorage = "0x5AC5be7AD95597d9DC6CFDBe59F36A95DBA3bf81";
  const nft721 = "0x06CD771FBa66103715AB64F8725fBc0b3eBb7209";
  const nftFactory = "0x24456e5fbce92303c1b4C45955963F2FEBA310C1";
  const owner = "0xdB4D6160532835f8Be98f3682eD165D5Ce02ECf9";
  // // LOCAL
  // const worldgramBase = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  // const nftStorage = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  // const nft721 = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
  // const nftFactory = "0xfdcce9b656a7a8ddcda8add0b978c1991690d2e4";
  // const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
