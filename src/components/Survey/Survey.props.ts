export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  image: string;
  lifetimeSeconds: number;
  options: Option[];
}

export interface Survey {
  id: number;
  title: string;
  image: string;
  questions: Question[];
}

export interface SurveyProps {
  dataSource: Survey;
  isLoading?: boolean;
  onSubmit?: (surveyId: number, answerIds: number[]) => void;
}
