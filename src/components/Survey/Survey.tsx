import React, { useState } from "react";
import { Button, message, Steps } from "antd";
import { SurveyProps } from "./Survey.props";
import "./Survey.css";

const { Step } = Steps;

export const Survey = (props: SurveyProps) => {
  const [current, setCurrent] = useState(0);
  const { questions } = props.dataSource;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        {questions.map(({ id }) => (
          <Step key={id} />
        ))}
      </Steps>
      <div className="steps-content" style={{ color: "black" }}>
        {questions[current].text}
      </div>
      <div className="steps-action">
        {current < questions.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === questions.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
