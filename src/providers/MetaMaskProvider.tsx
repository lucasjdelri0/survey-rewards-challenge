import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { message } from "antd";
import { ethers } from "ethers";

type MetaMaskContextTypes = {
  ethereum: any;
  isWrongNetwork: boolean;
  connectedAccount: string;
  accountBalance: string | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  switchToRopsten: () => void;
  connectAccount: () => void;
};

// See chain ids <https://docs.metamask.io/guide/ethereum-provider.html#chain-ids>
const ropstenChainId = "0x3";

const MetaMaskAccountContext = createContext<MetaMaskContextTypes>({
  ethereum: null,
  isWrongNetwork: false,
  connectedAccount: "",
  accountBalance: "",
  provider: undefined,
  switchToRopsten: () => {},
  connectAccount: () => {},
});

type ProviderProps = {
  children?: ReactNode;
};

const MetaMaskAccountProvider = ({ children }: ProviderProps) => {
  const { ethereum } = window;
  const defaultProvider = new ethers.providers.Web3Provider(ethereum);
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>(defaultProvider);
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [connectedAccount, setConnectedAccount] =
    useState<MetaMaskContextTypes["connectedAccount"]>("");
  const [balance, setBalance] =
    useState<MetaMaskContextTypes["accountBalance"]>();

  useEffect(() => {
    listenChainChanges();
    listenAccountChanges();
    initializeProvider();
  }, []);

  useEffect(() => {
    getAccountBalance();
  }, [web3Provider, connectedAccount]);

  const listenChainChanges = () => {
    const handleChainChanged = () => window.location.reload();
    ethereum.on("chainChanged", handleChainChanged);
  };

  const listenAccountChanges = () => {
    const handleAccountsChanged = () => window.location.reload();
    ethereum.on("accountsChanged", handleAccountsChanged);
  };

  const initializeProvider = async () => {
    if (!ethereum) {
      message.info("Make sure you have Metamask installed!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    setWeb3Provider(provider);

    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId !== ropstenChainId) {
      setIsWrongNetwork(true);
    }

    getConnectedAccount();
  };

  const handleAccounts = (accounts: string[]) => {
    if (accounts.length > 0) {
      setConnectedAccount(accounts[0]);
    } else {
      message.error("No authorized accounts yet");
    }
  };

  const getConnectedAccount = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(`accounts`, accounts);
    if (accounts && Array.isArray(accounts)) {
      handleAccounts(accounts);
    }
  };

  const connectAccount = async () => {
    if (!ethereum) {
      return;
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && Array.isArray(accounts)) {
        handleAccounts(accounts);
      }
    } catch (e) {
      throw e;
    }
  };

  const switchToRopsten = async () => {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ropstenChainId }],
    });
  };

  const getAccountBalance = async () => {
    if (!web3Provider || !connectedAccount) return;
    const signer = web3Provider.getSigner();
    const ethBalance = await signer.getBalance();
    setBalance(ethers.utils.formatEther(ethBalance));
  };

  const value = {
    ethereum: ethereum,
    isWrongNetwork,
    connectedAccount,
    accountBalance: balance,
    provider: web3Provider,
    switchToRopsten,
    connectAccount,
  };

  return (
    <MetaMaskAccountContext.Provider value={value}>
      {children}
    </MetaMaskAccountContext.Provider>
  );
};

export const useMetaMaskAccount = () => {
  return useContext(MetaMaskAccountContext);
};

export default MetaMaskAccountProvider;
