import { Space, Typography, Image, Button } from 'antd'
import { SurveyIntroProps } from './SurveyIntro.props'

const { Text, Title } = Typography

export const SurveyIntro = ({
  survey,
  onStart,
}: SurveyIntroProps): JSX.Element => (
  <Space direction='vertical' size='middle'>
    <Title level={2} style={{ marginBottom: 4, textAlign: 'center' }}>
      Daily Trivia
    </Title>
    <Text>{survey.title}</Text>
    <Image width='40vmin' src={survey.image} preview={false} />
    <Button type='primary' onClick={onStart} style={{ flex: 1 }}>
      Start Survey
    </Button>
  </Space>
)
