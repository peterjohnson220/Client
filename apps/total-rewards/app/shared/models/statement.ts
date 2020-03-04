import { Page } from './page';
import { Styling } from './styling';
import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

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
    },
    Pages: [{
      Sections: [{
        ColumnCount: 2,
        Columns: [{
          Layout: { Width: 6 },
          Controls: [{
            Title: 'Logo',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Image
          }]
        }, {
          Layout: { Width: 6 },
          Controls: [{
            Title: 'Your Total Rewards Statement',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Title
          }]
        }]
      }, {
        ColumnCount: 2,
        Columns: [{
          Layout: { Width: 6 },
          Controls: [{
            Title: 'Statement Summary',
            Layout: { Width: 12 },
            Content: 'This is a rich text area.You can add a statement summary or welcome letter to your employees ' +
                     'here.Use [ to find and insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as BaseControl, {
            Title: 'Your Total Rewards Breakdown',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Chart,
            DataFields: []
          } as BaseControl, {
            Title: 'In addition, the company also provides:',
            Layout: { Width: 12 },
            Content: 'This is a rich text area.You can add a statement summary or welcome letter to your employees ' +
                     'here.Use [ to find and insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as BaseControl]
        }, {
          Layout: { Width: 6 },
          Controls: [{
            Title: 'Cash Compensation',
            Layout: { Width: 12 },
            Category: 'Compensation',
            DataFields: ['Base', 'Bonus', 'TCC'],
            ControlType: TotalRewardsControlEnum.Calculation
          } as BaseControl, {
            Title: 'Retirement Savings',
            Layout: { Width: 12 },
            Category: 'Retirement',
            DataFields: ['401K', 'Savings Match', 'Pension Plan'],
            ControlType: TotalRewardsControlEnum.Calculation
          } as BaseControl, {
            Title: 'Health & Wellness',
            Layout: { Width: 12 },
            Category: 'Insurance',
            DataFields: ['Medical Insurance', 'Dental Insurance', 'Vision Insurance', 'Life Insurance', 'Long - Term Disability'],
            ControlType: TotalRewardsControlEnum.Calculation
          } as BaseControl, {
            Title: 'Additional',
            Layout: { Width: 12 },
            DataFields: ['Tuition Reimbursement', 'Paid Time Off(PTO)', 'Other Allowances'],
            ControlType: TotalRewardsControlEnum.Calculation
          } as BaseControl, {
            Title: 'Your Total Rewards Value',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Summary
          } as BaseControl]
        }]
      }]
    }]
  };
}

export function generateMockStatementWithSingleControl(controlType: TotalRewardsControlEnum): Statement {
  const statement = generateMockStatement();

  statement.Pages = [{
    Sections: [
      { Columns: [
        { Controls: [
            { ControlType: controlType, Layout: {} }
          ]
        }]
      } as any
    ]
  }];

  return statement;
}
