import { RadioChangeEvent } from 'antd'
import { Question } from 'components/types'

export interface SurveyQuestionProps {
  question?: Question
  value: number
  onAnswer: (e: RadioChangeEvent) => void
}
