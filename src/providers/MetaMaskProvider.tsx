import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { message } from 'antd'
import { ethers } from 'ethers'
import { getRpcErrorMsg } from 'utils'

interface MetaMaskContextTypes {
  ethereum: any
  isWrongNetwork: boolean
  connectedAccount: string | null
  ethBalance: string | null
  provider: ethers.providers.Web3Provider | null
  switchToRopsten: () => void
  connectAccount: () => void
}

const ropstenChainId = '0x3'

const MetaMaskAccountContext = createContext<MetaMaskContextTypes>({
  ethereum: null,
  isWrongNetwork: false,
  connectedAccount: '',
  ethBalance: '',
  provider: null,
  switchToRopsten: () => {},
  connectAccount: () => {},
})

interface ProviderProps {
  children?: ReactNode
}

const MetaMaskAccountProvider = ({ children }: ProviderProps): JSX.Element => {
  const { ethereum } = window
  const defaultProvider = new ethers.providers.Web3Provider(ethereum)
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>(defaultProvider)
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false)
  const [connectedAccount, setConnectedAccount] =
    useState<MetaMaskContextTypes['connectedAccount']>('')
  const [ethBalance, setEthBalance] =
    useState<MetaMaskContextTypes['ethBalance']>(null)

  useEffect(() => {
    const listenChainChanges = (): void =>
      ethereum.on('chainChanged', () => window.location.reload())

    listenChainChanges()
  }, [ethereum])

  useEffect(() => {
    const listenAccountChanges = (): void =>
      ethereum.on('accountsChanged', () => window.location.reload())

    listenAccountChanges()
  }, [ethereum])

  useEffect(() => {
    const getConnectedAccount = async (): Promise<void> => {
      const accounts = (await ethereum.request({
        method: 'eth_accounts',
      })) as string[]
      await handleAccounts(accounts)
    }

    const initializeProvider = async (): Promise<void> => {
      if (!ethereum) {
        await message.info('Make sure you have Metamask installed!', 3)
        return
      }
      try {
        const provider = new ethers.providers.Web3Provider(ethereum)
        setWeb3Provider(provider)
        const chainId = await ethereum.request({ method: 'eth_chainId' })
        if (chainId !== ropstenChainId) {
          setIsWrongNetwork(true)
        }
        await getConnectedAccount()
      } catch (e) {
        await message.error(getRpcErrorMsg(e), 3)
      }
    }

    initializeProvider()
  }, [ethereum])

  useEffect(() => {
    const getAccountBalance = async (): Promise<void> => {
      if (!web3Provider || !connectedAccount) return
      try {
        const signer = web3Provider.getSigner()
        const ethBalance = await signer.getBalance()
        setEthBalance(ethers.utils.formatEther(ethBalance))
      } catch (e) {
        await message.error(getRpcErrorMsg(e), 3)
      }
    }

    getAccountBalance()
  }, [web3Provider, connectedAccount])

  const handleAccounts = async (accounts: string[]): Promise<void> => {
    if (accounts.length > 0) {
      setConnectedAccount(accounts[0])
    } else {
      await message.error('No authorized accounts yet')
    }
  }

  const connectAccount = async (): Promise<void> => {
    if (!ethereum) {
      return
    }
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (accounts && Array.isArray(accounts)) {
        await handleAccounts(accounts)
      }
    } catch (e) {
      await message.error(getRpcErrorMsg(e), 3)
    }
  }

  const switchToRopsten = async (): Promise<void> => {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ropstenChainId }],
    })
  }

  const value = {
    ethereum,
    isWrongNetwork,
    connectedAccount,
    ethBalance,
    provider: web3Provider,
    switchToRopsten,
    connectAccount,
  }

  return (
    <MetaMaskAccountContext.Provider value={value}>
      {children}
    </MetaMaskAccountContext.Provider>
  )
}

export const useMetaMaskAccount = (): MetaMaskContextTypes => {
  return useContext(MetaMaskAccountContext)
}

export default MetaMaskAccountProvider
