import { FlsaQuestion } from './flsa-question.model';

export interface FlsaExemptionAndQuestions {
  Exemption: string;
  Description: string;
  FooterDescription: string;
  Questions: FlsaQuestion[];
}
