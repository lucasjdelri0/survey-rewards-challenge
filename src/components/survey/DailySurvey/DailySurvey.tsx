import { useEffect, useState } from 'react'
import { Steps, RadioChangeEvent } from 'antd'
import { DailySurveyProps } from './DailySurvey.props'
import SurveyQuestion from './_components/SurveyQuestion'
import SurveyOverview from './_components/SurveyOverview'
import './DailySurvey.css'

const { Step } = Steps

export const DailySurvey = ({
  dataSource,
  isLoading = false,
  onSubmit,
}: DailySurveyProps): JSX.Element => {
  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState(0)
  const [answerIds, setAnswerIds] = useState<number[]>([])
  const { id: surveyId, questions } = dataSource

  const currentQuestion = questions.find(({ id }) => id === current)

  useEffect(() => {
    const next = (): void => {
      setValue(0)
      setCurrent(current + 1)
    }

    if (current < questions.length) {
      setAnswerIds([...answerIds, value])
      const timer = setTimeout(
        () => next(),
        questions[current].lifetimeSeconds * 1000
      )
      return () => {
        clearTimeout(timer)
      }
    }
  }, [current, questions])

  const onChange = (e: RadioChangeEvent): void => {
    answerIds.pop()
    setValue(e.target.value)
    setAnswerIds([...answerIds, e.target.value])
  }

  return (
    <>
      <Steps current={current}>
        {questions.map(({ id }) => (
          <Step key={id} />
        ))}
      </Steps>
      <div className='steps-content'>
        {current >= questions.length ? (
          <SurveyOverview
            loading={isLoading}
            surveyId={surveyId}
            questions={questions}
            answerIds={answerIds}
            onSubmit={() => onSubmit?.(surveyId, answerIds)}
          />
        ) : (
          <SurveyQuestion
            question={currentQuestion}
            onAnswer={onChange}
            value={value}
          />
        )}
      </div>
    </>
  )
}
