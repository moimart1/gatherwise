export class CreateTransactionDto {
  _id?: string;
  date: string;
  description: string;
  amount: number;
  author: string;
  index: number; // Help to be unique
  reviewed?: boolean;
  note?: string;
}
