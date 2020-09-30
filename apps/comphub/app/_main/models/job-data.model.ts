import { PricingPaymarket } from './pricing-paymarket.model';

export interface JobData {
  JobId: number;
  JobCode: string;
  JobTitle: string;
  JobDescription: string;
  Education: string;
  YearsOfExperience: string;
  ManagesEmployees: boolean;
  Skills: string[];
  FLSAStatus: string;
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Tcc25?: number;
  Tcc50?: number;
  Tcc75?: number;
  Incs?: number;
  Orgs?: number;
  ShowJd: boolean;
  ExchangeName?: string;
  EffectiveDate?: Date;
  PayMarket?: PricingPaymarket;
}

export interface JobGridData {
  Total: number;
  Data: JobData[];
}

export function generateFakeJobData(): JobData {
  return{
    JobId: 1,
    JobCode: 'Ab1234',
    Tcc50: 100000,
    Base50: 100000,
    YearsOfExperience: '6+',
    Education: 'College',
    FLSAStatus: '',
    Incs: 1,
    JobDescription: 'Some job description',
    JobTitle: 'Job A',
    ManagesEmployees: false,
    Orgs: 2,
    Skills: ['Leadership', 'Analytical skills', 'Problem-solving', 'Ability to work within a team.'],
    ShowJd: false
  };

}
