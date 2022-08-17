export type Option = {
  id: number;
  text: string;
};

export type Question = {
  id: number;
  text: string;
  image: string;
  lifetimeSeconds: number;
  options: Option[];
};

export type Survey = {
  id: number;
  title: string;
  image: string;
  questions: Question[];
};

export interface SurveyProps {
  dataSource: Survey;
  isLoading?: boolean;
  onSubmit?: (surveyId: number, answerIds: number[]) => void;
}
