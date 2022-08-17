import { useState } from "react";
import { Button, Space, Typography, Image, message } from "antd";
import Page from "components/layout/Page";
import Survey from "components/Survey";
import { useMetaMaskAccount } from "providers/MetaMaskProvider";
import surveySamples from "utils/survey-sample.json";
import "./App.css";
import { Survey as TSurvey } from "components/Survey/Survey.props";

const { Text, Title } = Typography;

const randomSurvey: TSurvey =
  surveySamples[Math.floor(Math.random() * surveySamples.length)];

const App = () => {
  const { connectedAccount } = useMetaMaskAccount();
  const [surveyStarted, setSurveyStarted] = useState(false);

  const handleSubmit = (surveyId: number, answerIds: number[]) => {
    message.success(
      <Space direction="vertical">
        <Text>Survey successfully submited</Text>
        <Text>
          {JSON.stringify({
            surveyId,
            answerIds,
          })}
        </Text>
      </Space>
    );
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
          {!surveyStarted ? (
            <Space direction="vertical" size="middle">
              <Title level={2} style={{ marginBottom: 4, textAlign: "center" }}>
                Daily Trivia
              </Title>
              <Text>{randomSurvey.title}</Text>
              <Image width="40vmin" src={randomSurvey.image} preview={false} />
              {/* <img src={randomSurvey.image} className="App-logo" alt="logo" /> */}
              <Button
                type="primary"
                onClick={() => setSurveyStarted(!surveyStarted)}
                style={{ flex: 1 }}
              >
                Start Survey
              </Button>
            </Space>
          ) : (
            <Survey
              dataSource={randomSurvey}
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
