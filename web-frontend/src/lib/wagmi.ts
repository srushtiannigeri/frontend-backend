import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal"; // Use the Modal version for the full list
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", 
 
  rpcTarget: "https://eth.llamarpc.com", 
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Initialize the Modal version to get the Social/Email popup
export const web3AuthInstance = new Web3Auth({
  clientId: "BIJMbpFH3y2h_iLDDDDFSutWW9HyIxcRkOEye9UvLzQIhcshB2wrvnAnCdEvJshSA1s0ehLTURboE09Hk0oBStg", // REQUIRED: Get from dashboard.web3auth.io
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    Web3AuthConnector({
      web3AuthInstance,
    }),
  ],
});