import { Survey } from '../types'

export interface DailySurveyProps {
  dataSource: Survey
  isLoading?: boolean
  onSubmit: (surveyId: number, answerIds: number[]) => void
}
