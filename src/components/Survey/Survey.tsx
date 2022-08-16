import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (current < questions.length) {
      const timer = setTimeout(
        () => next(),
        questions[current].lifetimeSeconds * 1000
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [current, questions]);

  return (
    <>
      <Steps current={current}>
        {questions.map(({ id }) => (
          <Step key={id} />
        ))}
      </Steps>
      <div className="steps-content" style={{ color: "black" }}>
        {current >= questions.length
          ? "Survey Overview Papi"
          : questions[current].text}
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
        {current > 0 && current < questions.length && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
