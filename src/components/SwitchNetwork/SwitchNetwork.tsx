import { Button, Tooltip } from 'antd'
import { SwitchNetworkProps } from './SwitchNetwork.props'

export const SwitchNetwork = ({
  tooltip,
  icon,
  onClick,
}: SwitchNetworkProps): JSX.Element => (
  <Tooltip title={tooltip}>
    <Button
      type='primary'
      shape='circle'
      danger
      icon={icon}
      onClick={onClick}
    />
  </Tooltip>
)
