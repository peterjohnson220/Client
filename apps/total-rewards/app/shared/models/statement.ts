import { Page } from './page';
import { Styling } from './styling';

export interface Statement {
  Id: number;
  StatementId: string;
  TemplateId: string;
  Name: string;
  CreatedBy: string;
  CreatedDate: Date;
  LastRunBy: string;
  LastRunDate: Date;
  Employees: number;
  Status: 'Active' | 'Draft';
  Pages: Page[];
  StatementTitleStyles: Styling;
  SectionTitlesStyles: Styling;
  BenefitFieldTitlesStyles: Styling;
  BenefitFieldDataStyles: Styling;
  BenefitFieldCalculationsStyles: Styling;
}

export function generateMockStatement(): Statement {
  return {
    Id: 1,
    StatementId: '1',
    TemplateId: '1',
    Name: 'Name',
    CreatedBy: 'CreatedBy',
    CreatedDate: new Date('December 17, 2019 03:24:00'),
    LastRunBy: 'LastRunBy',
    LastRunDate: new Date('December 17, 2019 03:24:00'),
    Employees: 13,
    Status: 'Active',
    Pages: [],
    StatementTitleStyles: {
      FontFamily: 'Segoe UI Semibold',
      FontColor: '#000000',
      FontSizeInPoints: 16,
      Emphasis: ''
    },
    SectionTitlesStyles: {
      FontFamily: 'Segoe UI',
      FontColor: '#28435A',
      FontSizeInPoints: 10,
      Emphasis: 'Bold'
    },
    BenefitFieldTitlesStyles: {
      FontFamily: 'Segoe UI',
      FontColor: '#000000',
      FontSizeInPoints: 10,
      Emphasis: ''
    },
    BenefitFieldDataStyles: {
      FontFamily: 'Segoe UI',
      FontColor: '#000000',
      FontSizeInPoints: 10,
      Emphasis: ''
    },
    BenefitFieldCalculationsStyles: {
      FontFamily: 'Segoe UI',
      FontColor: '#000000',
      FontSizeInPoints: 10,
      Emphasis: ''
    }
  };
}
