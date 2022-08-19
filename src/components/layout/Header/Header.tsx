import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
  Layout,
  Space,
  Menu,
  Button,
  Avatar,
  Typography,
  Dropdown,
  MenuProps,
  message,
  Tooltip,
} from 'antd'
import {
  GithubOutlined,
  WalletOutlined,
  WarningOutlined,
  CopyOutlined,
  SketchOutlined,
} from '@ant-design/icons'
import { useMetaMaskAccount } from 'providers/MetaMaskProvider'
import { roundToTwo, shortenAddress } from 'utils'
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
        setQuizBalance(`${balance} ${symbol}`)
      } catch (e) {}
    }

    if (quizBalance == null) {
      void getContractInfo()
    }
  }, [connectedAccount, quizContract, quizBalance])

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item')
  }

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: `Balance: ${roundToTwo(ethBalance) ?? ''} rETH`,
          key: '0',
          icon: <SketchOutlined />,
        },
        {
          label: 'Copy wallet address',
          key: '1',
          icon: <CopyOutlined />,
        },
      ]}
    />
  )

  return (
    <AntHeader
      className='headerContainer'
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        backgroundColor,
        padding: '0 50px',
      }}
    >
      {repoHref && (
        <AntLink href={repoHref} target='_blank' className='ghLink'>
          <GithubOutlined className='headerLogo' />
        </AntLink>
      )}
      <Space align='center' size='large'>
        {!connectedAccount ? (
          <Button type='primary' onClick={connectAccount}>
            Connect Wallet
          </Button>
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
              <Tooltip title='You’re connected to the wrong network'>
                <Button
                  type='primary'
                  shape='circle'
                  danger
                  icon={<WarningOutlined />}
                  onClick={switchToRopsten}
                />
              </Tooltip>
            )}
          </>
        )}
      </Space>
    </AntHeader>
  )
}
