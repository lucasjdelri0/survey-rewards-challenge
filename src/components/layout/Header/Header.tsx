import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
  Layout,
  Space,
  Menu,
  Avatar,
  Typography,
  Dropdown,
  message,
} from 'antd'
import {
  GithubOutlined,
  WalletOutlined,
  WarningOutlined,
  SketchOutlined,
} from '@ant-design/icons'
import { useMetaMaskAccount } from 'providers/MetaMaskProvider'
import { getRpcErrorMsg, roundToTwo, shortenAddress } from 'utils'
import ConnectWallet from 'components/ConnectWallet'
import SwitchNetwork from 'components/SwitchNetwork'
import { getQuizContract } from 'utils/contractHelpers'
import { HeaderProps } from './Header.props'
import './Header.css'

const { Header: AntHeader } = Layout
const { Link: AntLink, Title } = Typography

export const Header = (props: HeaderProps): JSX.Element => {
  const [quizBalance, setQuizBalance] = useState<string | null>()
  const { backgroundColor, repoHref, avatarImageSrc } = props
  const {
    connectedAccount,
    connectAccount,
    isWrongNetwork,
    switchToRopsten,
    ethBalance,
    provider,
  } = useMetaMaskAccount()

  const signer = provider?.getSigner()
  const quizContract = getQuizContract(signer)

  useEffect(() => {
    const getContractInfo = async (): Promise<void> => {
      try {
        const symbol = (await quizContract.symbol()) as string
        const balanceBN = await quizContract.balanceOf(connectedAccount)
        const balance = ethers.utils.formatEther(balanceBN)
        const balanceToShow =
          +balance % 1 === 0 ? parseInt(balance) : roundToTwo(balance)
        setQuizBalance(`${balanceToShow ?? ''} ${symbol}`)
      } catch (e) {
        await message.error(getRpcErrorMsg(e), 3)
      }
    }

    if (connectedAccount && quizContract) getContractInfo()
  }, [connectedAccount, quizContract])

  const menu = (
    <Menu
      items={[
        {
          label: `Balance: ${roundToTwo(ethBalance) ?? ''} rETH`,
          key: '0',
          icon: <SketchOutlined />,
        },
      ]}
    />
  )

  return (
    <AntHeader
      className='headerContainer'
      style={{
        backgroundColor,
      }}
    >
      {repoHref && (
        <AntLink href={repoHref} target='_blank' className='ghLink'>
          <GithubOutlined className='headerLogo' />
        </AntLink>
      )}
      <Space align='center' size='large'>
        {!connectedAccount ? (
          <ConnectWallet onClick={connectAccount} />
        ) : (
          <>
            {quizBalance && (
              <Title level={5} style={{ whiteSpace: 'nowrap', margin: 0 }}>
                {quizBalance}
              </Title>
            )}
            {avatarImageSrc && <Avatar src={avatarImageSrc} />}
            <Dropdown.Button
              overlay={menu}
              placement='bottomRight'
              arrow={{ pointAtCenter: true }}
              icon={<WalletOutlined />}
            >
              {shortenAddress(connectedAccount)}
            </Dropdown.Button>
            {isWrongNetwork && (
              <SwitchNetwork
                tooltip='You’re connected to the wrong network'
                icon={<WarningOutlined />}
                onClick={switchToRopsten}
              />
            )}
          </>
        )}
      </Space>
    </AntHeader>
  )
}
