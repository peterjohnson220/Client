import { FlsaExemptionAndQuestions } from './flsa-exemption-and-questions.model';

export interface FlsaQuestionnaireDetails {
  FlsaQuestionnaireVersion: number;
  JobDescriptionId: number;
  JobDescriptionVersion: number;
  CompanyId: number;
  FlsaQuestionnaireStatus: string;
  EditDate: string;
  EditUser: string;
  CreateDate: string;
  CreateUser: string;
  Header: string;
  Disclaimer: string;
  ExemptionAndQuestions: FlsaExemptionAndQuestions[];
}
