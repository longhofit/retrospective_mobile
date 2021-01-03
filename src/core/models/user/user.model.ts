import { AccountType } from "../type";

export class User {
  accountType: AccountType;
  created: string;
  email:string;
  freeTrialStartForm: Date;
  id: string;
  isFreeTrialExpired: boolean;
  is_trial_period: boolean;
  language: string;
  name: string;
  password: string;
  photo: string;
  privateNewBoardRemain: number;
  publicNewBoardRemain: number;
  subscriptionStartFrom: Date;
  subscriptionType: number;
  updated: string;
  username: string;
}