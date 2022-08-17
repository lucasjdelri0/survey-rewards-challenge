import { useState } from "react";
import { Button, Space, Typography, Image, message } from "antd";
import Page from "components/layout/Page";
import Survey from "components/Survey";
import { useMetaMaskAccount } from "providers/MetaMaskProvider";
import surveySamples from "utils/survey-sample.json";
import "./App.css";
import { Survey as TSurvey } from "components/Survey/Survey.props";
import { getQuizContract } from "utils/contractHelpers";

const { Text, Title } = Typography;
const randomSurvey: TSurvey =
  surveySamples[Math.floor(Math.random() * surveySamples.length)];

const App = () => {
  const { connectedAccount, provider } = useMetaMaskAccount();
  const [surveyInProgress, setSurveyInProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quizContract = getQuizContract(provider?.getSigner());

  const handleSubmit = async (surveyId: number, answerIds: number[]) => {
    setIsSubmitting(true);
    try {
      const tx = await quizContract.submit(surveyId, answerIds);
      await tx.wait();
      message.success("Your answers were successfully submited", 3, () => {
        setSurveyInProgress(false);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      {!connectedAccount ? (
        <div className="App-content">
          <p style={{ color: "black" }}>
            Connect your wallet to see the magic!!!
          </p>
        </div>
      ) : (
        <div className="App-content">
          {!surveyInProgress ? (
            <Space direction="vertical" size="middle">
              <Title level={2} style={{ marginBottom: 4, textAlign: "center" }}>
                Daily Trivia
              </Title>
              <Text>{randomSurvey.title}</Text>
              <Image width="40vmin" src={randomSurvey.image} preview={false} />
              <Button
                type="primary"
                onClick={() => setSurveyInProgress(true)}
                style={{ flex: 1 }}
              >
                Start Survey
              </Button>
            </Space>
          ) : (
            <Survey
              dataSource={randomSurvey}
              isLoading={isSubmitting}
              onSubmit={(surveyId, answerIds) =>
                handleSubmit(surveyId, answerIds)
              }
            />
          )}
        </div>
      )}
    </Page>
  );
};

export default App;
