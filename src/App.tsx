import React from "react";
import { Button } from "antd";
import Page from "components/layout/Page";
import { useMetaMaskAccount } from "providers/MetaMaskProvider";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const { connectedAccount } = useMetaMaskAccount();

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
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{ color: "black" }}>Survey Challenge by Lucas Del Rio</p>
          <Button type="primary">Start</Button>
        </div>
      )}
    </Page>
  );
};

export default App;
