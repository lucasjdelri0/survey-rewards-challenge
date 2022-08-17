import { useEffect, useState } from "react";
import {
  Button,
  Steps,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
} from "antd";
import { SurveyProps } from "./Survey.props";
import "./Survey.css";

const { Step } = Steps;
const { Title } = Typography;

export const Survey = (props: SurveyProps) => {
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState(0);
  const [answerIds, setAnswerIds] = useState<number[]>([]);
  const { dataSource, onSubmit } = props;
  const { id: surveyId, questions } = dataSource;

  const currentQuestion = questions.find(({ id }) => id === current);

  useEffect(() => {
    const next = () => {
      setValue(0);
      setCurrent(current + 1);
    };

    if (current < questions.length) {
      setAnswerIds([...answerIds, value]);
      const timer = setTimeout(
        () => next(),
        questions[current].lifetimeSeconds * 1000
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [current, questions]);

  const onChange = (e: RadioChangeEvent) => {
    answerIds.pop();
    setValue(e.target.value);
    setAnswerIds([...answerIds, e.target.value]);
  };

  return (
    <>
      <Steps current={current}>
        {questions.map(({ id }) => (
          <Step key={id} />
        ))}
      </Steps>
      <div className="steps-content">
        {current >= questions.length ? (
          <Space direction="vertical" size="large">
            <Title level={2} style={{ marginBottom: 0 }}>
              Survey Overview
            </Title>
            {questions.map(({ id, text, options }) => {
              const optSelected = options.find(
                ({ id: optionId }) => answerIds[id] === optionId
              );
              return (
                <div key={id}>
                  <Title level={4} style={{ marginBottom: 4 }}>
                    {text}
                  </Title>
                  <Radio checked>{optSelected?.text}</Radio>
                </div>
              );
            })}
            <Button
              type="primary"
              onClick={() => onSubmit && onSubmit(surveyId, answerIds)}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Space>
        ) : (
          <>
            <Title level={4}>{questions[current].text}</Title>
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                {currentQuestion?.options.map(({ id, text }) => (
                  <Radio value={id} key={id}>
                    {text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </>
        )}
      </div>
    </>
  );
};
