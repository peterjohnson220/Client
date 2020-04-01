import { Page } from './page';
import {BaseControl, CalculationControl, ChartControl, ImageControl, RichTextControl} from './';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';
import {TitleControl} from './title-control';

export interface Statement {
  StatementId: string;
  StatementName: string;
  TemplateId: string;
  TemplateName: string;
  Pages: Page[];
  CreatedBy: string;
  CreatedById: number;
  CreatedDate: Date;
}

export function generateMockStatement(): Statement {
  return {
    StatementId: '1',
    StatementName: 'Name',
    TemplateId: '1',
    TemplateName: 'Template Name',
    Pages: [{
      Sections: [{
        Columns: [{
          Layout: { Width: 6 },
          Controls: [{
            Id: '100',
            Title: 'Logo',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Image
          } as ImageControl]
        }, {
          Layout: { Width: 6 },
          Controls: [{
            Id: '101',
            Title: 'Your Total Rewards Statement',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Title
          } as TitleControl]
        }]
      }, {
        Columns: [{
          Layout: { Width: 6 },
          Controls: [{
            Id: '102',
            Title: 'Statement Summary',
            Layout: { Width: 12 },
            Content: 'This is a rich text area.You can add a statement summary or welcome letter to your employees ' +
              'here.Use [ to find and insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as RichTextControl, {
            Title: 'Your Total Rewards Breakdown',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Chart,
            DataFields: []
          } as ChartControl, {
            Title: 'In addition, the company also provides:',
            Layout: { Width: 12 },
            Content: 'This is a rich text area.You can add a statement summary or welcome letter to your employees ' +
              'here.Use [ to find and insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as RichTextControl]
        }, {
          Layout: { Width: 6 },
          Controls: [{
            Id: '105',
            Title: 'Cash Compensation',
            ControlType: TotalRewardsControlEnum.Calculation,
            Layout: { Width: 12 },
            Category: 'Compensation',
            DataFields: [
              { Id: '1', DatabaseField: 'Base', DefaultName: 'Base', OverrideName: '', IsVisible: true},
              { Id: '2', DatabaseField: 'Bonus', DefaultName: 'Bonus', OverrideName: '', IsVisible: true},
              { Id: '3', DatabaseField: 'TCC', DefaultName: 'TCC', OverrideName: '', IsVisible: true}
            ],
          } as CalculationControl, {
            Title: 'Retirement Savings',
            Layout: { Width: 12 },
            Category: 'Retirement',
            DataFields: [
              { Id: '1', DatabaseField: '401K', DefaultName: '401K', OverrideName: '', IsVisible: true},
              { Id: '2', DatabaseField: 'Savings Match', DefaultName: 'Savings Match', OverrideName: '', IsVisible: true},
              { Id: '3', DatabaseField: 'Pension Plan', DefaultName: 'Pension Plan', OverrideName: '', IsVisible: true}
            ],
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: 'Health & Wellness',
            Layout: { Width: 12 },
            Category: 'Insurance',
            DataFields: [
              { Id: '1', DatabaseField: 'Medical Insurance', DefaultName: 'Medical Insurance', OverrideName: '', IsVisible: true},
              { Id: '2', DatabaseField: 'Dental Insurance', DefaultName: 'Dental Insurance', OverrideName: '', IsVisible: true},
              { Id: '3', DatabaseField: 'Vision Insurance', DefaultName: 'Vision Insurance', OverrideName: '', IsVisible: true},
              { Id: '4', DatabaseField: 'Life Insurance', DefaultName: 'Life Insurance', OverrideName: '', IsVisible: true},
              { Id: '5', DatabaseField: 'Long - Term Disability', DefaultName: 'Long - Term Disability', OverrideName: '', IsVisible: true}
            ],
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: 'Additional',
            Layout: { Width: 12 },
            DataFields: [
              { Id: '1', DatabaseField: 'Tuition Reimbursement', DefaultName: 'Tuition Reimbursement', OverrideName: '', IsVisible: true},
              { Id: '2', DatabaseField: 'Paid Time Off(PTO)', DefaultName: 'Paid Time Off(PTO)', OverrideName: '', IsVisible: true},
              { Id: '3', DatabaseField: 'Other Allowances', DefaultName: 'Other Allowances', OverrideName: '', IsVisible: true}
            ],
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: 'Your Total Rewards Value',
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.CalculationSummary
          } as BaseControl]
        }]
      }]
    }],
    CreatedBy: 'CreatedBy',
    CreatedById: 1,
    CreatedDate: new Date('December 17, 2019 03:24:00')
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
