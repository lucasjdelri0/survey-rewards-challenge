import { RadioChangeEvent } from 'antd'
import { Question } from 'components/survey/types'

export interface SurveyQuestionProps {
  question?: Question
  value: number
  onAnswer: (e: RadioChangeEvent) => void
}
