import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { BigNumber, ethers } from "ethers";
import Page from "components/layout/Page";
import Survey from "components/Survey";
import { useMetaMaskAccount } from "providers/MetaMaskProvider";
import { getQuizContract } from "utils/contractHelpers";
import surveySamples from "utils/survey-sample.json";
import "./App.css";
import { Survey as TSurvey } from "components/Survey/Survey.props";

const App = () => {
  const [surveyStarted, setSurveyStarted] = useState(false);
  const { connectedAccount, provider } = useMetaMaskAccount();
  const dailySurvey: TSurvey =
    surveySamples[Math.floor(Math.random() * surveySamples.length)];

  useEffect(() => {
    const getContractInfo = async () => {
      const quizContract = getQuizContract(provider);
      const symbol = await quizContract.symbol();
      const balanceBN = await quizContract.balanceOf(connectedAccount);
      const balance = ethers.utils.formatEther(balanceBN);
      console.log("balance", balance);
    };

    if (provider && connectedAccount) {
      getContractInfo();
    }
  }, [connectedAccount, provider]);

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
            <>
              <img src={dailySurvey.image} className="App-logo" alt="logo" />
              <p style={{ color: "black" }}>{dailySurvey.title}</p>
              <Button
                type="primary"
                onClick={() => setSurveyStarted(!surveyStarted)}
              >
                Start Survey
              </Button>
            </>
          ) : (
            <Survey dataSource={dailySurvey} />
          )}
        </div>
      )}
    </Page>
  );
};

export default App;
