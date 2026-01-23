import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  return (
    <ConnectButton 
      accountStatus="address"
      showBalance={false}
      chainStatus="icon"
    />
  );
}