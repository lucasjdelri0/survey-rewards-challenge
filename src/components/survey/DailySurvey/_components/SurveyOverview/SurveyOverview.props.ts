import { Question } from 'components/survey/types'

export interface SurveyOverviewProps {
  surveyId: number
  questions: Question[]
  answerIds: number[]
  loading: boolean
  onSubmit: (surveyId: number, answerIds: number[]) => void
}
