import { Button } from 'antd'
import { ConnectWalletProps } from './ConnectWallet.props'

export const ConnectWallet = ({ onClick }: ConnectWalletProps): JSX.Element => (
  <Button type='primary' onClick={onClick}>
    Connect Wallet
  </Button>
)
