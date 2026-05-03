export interface Card {
  id: number;
  bank_name: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
}

export type CardFormValues = {
  bank_name: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
};
