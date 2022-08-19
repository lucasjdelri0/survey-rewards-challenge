import { useState } from 'react'
import { message } from 'antd'
import Page from 'components/layout/Page'
import DailySurvey from 'components/survey/DailySurvey'
import { useMetaMaskAccount } from 'providers/MetaMaskProvider'
import surveySamples from 'utils/survey-sample.json'
import { getQuizContract } from 'utils/contractHelpers'
import { getRpcErrorMsg } from 'utils'
import SurveyIntro from 'components/survey/SurveyIntro'
import { Survey } from 'components/survey/types'
import './App.css'
import Disconnected from 'components/Disconnected'

const randomSurvey: Survey =
  surveySamples[Math.floor(Math.random() * surveySamples.length)]

const App = (): JSX.Element => {
  const { connectedAccount, provider } = useMetaMaskAccount()
  const [surveyInProgress, setSurveyInProgress] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const quizContract = getQuizContract(provider?.getSigner())

  const handleSubmit = async (
    surveyId: number,
    answerIds: number[]
  ): Promise<void> => {
    setIsSubmitting(true)
    try {
      const tx = await quizContract.submit(surveyId, answerIds)
      await tx.wait()
      await message.success(
        'Your survey was sent successfully. You´ve been rewarded with 1 QUIZ.',
        3,
        () => {
          setSurveyInProgress(false)
        }
      )
    } catch (e) {
      await message.error(getRpcErrorMsg(e), 3)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      {!connectedAccount ? (
        <Disconnected />
      ) : (
        <div className='App-content'>
          {!surveyInProgress ? (
            <SurveyIntro
              survey={randomSurvey}
              onStart={() => setSurveyInProgress(true)}
            />
          ) : (
            <DailySurvey
              dataSource={randomSurvey}
              isLoading={isSubmitting}
              onSubmit={async (surveyId, answerIds) =>
                await handleSubmit(surveyId, answerIds)
              }
            />
          )}
        </div>
      )}
    </Page>
  )
}

export default App
