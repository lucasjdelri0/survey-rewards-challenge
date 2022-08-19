import { Radio, Space, Typography } from 'antd'
import { SurveyQuestionProps } from './SurveyQuestion.props'

const { Title } = Typography

export const SurveyQuestion = ({
  question,
  value,
  onAnswer,
}: SurveyQuestionProps): JSX.Element => (
  <>
    <Title level={4}>{question?.text}</Title>
    <Radio.Group onChange={onAnswer} value={value}>
      <Space direction='vertical'>
        {question?.options.map(({ id, text }) => (
          <Radio value={id} key={id}>
            {text}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  </>
)
