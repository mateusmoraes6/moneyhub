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

export interface CardFromDB {
  id: number;
  user_id: string;
  name: string;
  bank: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
  created_at: string;
}
