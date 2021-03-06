import { Page } from './page';
import { BaseControl, CalculationControl, ChartControl, ImageControl, RichTextControl, AuditRecord, Settings, Layout } from './index';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';
import { TitleControl } from './title-control';
import { generateMockAuditRecord } from './audit-record';
import { generateMockSettings } from './settings';

export interface Statement {
  StatementId: string;
  StatementName: string;
  TemplateId: string;
  TemplateName: string;
  CreatedBy: string;
  CreatedById: number;
  CreatedDate: Date;
  AuditRecord: AuditRecord;
  Pages: Page[];
  Settings: Settings;
  EffectiveDate: any;
  AssignedCompanyEmployeeIds?: number[];
  IsStatementGenerating: boolean;
  LastGeneratedDate: Date;
  LastGeneratedBy: string;
}

export function generateMockStatement(): Statement {
  return {
    StatementId: '1',
    StatementName: 'Name',
    TemplateId: '1',
    TemplateName: 'Template Name',
    CreatedBy: 'CreatedBy',
    CreatedDate: new Date('December 17, 2019 03:24:00'),
    AuditRecord: generateMockAuditRecord(),
    Settings: generateMockSettings(),
    EffectiveDate: new Date('December 17, 2019 03:24:00'),
    IsStatementGenerating: false,
    LastGeneratedDate: new Date(),
    LastGeneratedBy: 'Joe Shmoe',
    Pages: [{
      Sections: [{
        Columns: [{
          Layout: { Width: 3 },
          Controls: [{
            Id: '100',
            Title: { Default: '', Override: null },
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Image
          } as ImageControl]
        }, {
          Layout: { Width: 9 },
          Controls: [{
            Id: '101',
            Title: { Default: 'Your Total Rewards Statement', Override: null },
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Title
          } as TitleControl]
        }]
      }, {
        Columns: [{
          Layout: { Width: 6 },
          Controls: [{
            Id: '102',
            Title: { Default: 'Statement Summary', Override: null },
            Layout: { Width: 12 },
            Content: 'This is a rich text area. You can add a statement summary or welcome letter to your employees here. Use [ to find and ' +
              'insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as RichTextControl, {
            Title: { Default: 'Your Total Rewards Breakdown', Override: null },
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.Chart,
            DataFields: []
          } as ChartControl, {
            Title: { Default: 'In addition, the company also provides:', Override: null },
            Layout: { Width: 12 },
            Content: 'This is a rich text area.You can add a statement summary or welcome letter to your employees ' +
              'here.Use [ to find and insert existing employee or company fields into your text.',
            ControlType: TotalRewardsControlEnum.RichTextEditor
          } as RichTextControl]
        }, {
          Layout: { Width: 6 },
          Controls: [{
            Id: '105',
            Title: { Default: 'Cash Compensation', Override: null },
            ControlType: TotalRewardsControlEnum.Calculation,
            Layout: { Width: 12 },
            Category: 'Compensation',
            Summary: { Default: 'Total', Override: null },
            DataFields: [
              { Id: '1', DatabaseField: 'EmployeeBase', Name: { Default: 'Base Salary' }, IsVisible: true},
              { Id: '2', DatabaseField: 'EmployeeBonus', Name: { Default: 'Bonus' }, IsVisible: true},
              { Id: '3', DatabaseField: 'EmployeeSTI', Name: { Default: 'Short Term Incentive' }, IsVisible: true},
              { Id: '3', DatabaseField: 'EmployeeLTI', Name: { Default: 'Long Term Incentive' }, IsVisible: true}
            ],
          } as CalculationControl, {
            Title: { Default: 'Retirement Savings', Override: null },
            Layout: { Width: 12 },
            Category: 'Retirement',
            DataFields: [
              { Id: '1', DatabaseField: 'Savings_401K_Match', Name: { Default: '401K Savings Match' }, IsVisible: true},
              { Id: '2', DatabaseField: 'Pension_Plan', Name: { Default: 'Pension Plan' }, IsVisible: true}
            ],
            Summary: { Default: 'Total', Override: null },
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: { Default: 'Health & Wellness', Override: null },
            Layout: { Width: 12 },
            Category: 'Insurance',
            Summary: { Default: 'Total', Override: null },
            DataFields: [
              { Id: '1', DatabaseField: 'Medical_Plan', Name: { Default: 'Medical Insurance' }, IsVisible: true},
              { Id: '2', DatabaseField: 'Dental_Plan', Name: { Default: 'Dental Insurance' }, IsVisible: true},
              { Id: '3', DatabaseField: 'Vision_Plan', Name: { Default: 'Vision Insurance' }, IsVisible: true},
              { Id: '4', DatabaseField: 'Life_Insurance', Name: { Default: 'Life Insurance' }, IsVisible: true},
              { Id: '5', DatabaseField: 'Long_Term_Disability', Name: { Default: 'Long - Term Disability' }, IsVisible: true},
              { Id: '5', DatabaseField: 'Short_Term_Disability', Name: { Default: 'Short - Term Disability' }, IsVisible: true}
            ],
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: { Default: 'Additional', Override: null },
            Layout: { Width: 12 },
            Summary: { Default: 'Total', Override: null },
            DataFields: [
              { Id: '1', DatabaseField: 'Tuition_Reimbursement',  Name: { Default: 'Tuition Reimbursement' }, IsVisible: true},
              { Id: '2', DatabaseField: 'PTO',  Name: { Default: 'Paid Time Off' }, IsVisible: true},
              { Id: '3', DatabaseField: 'Other_Allowance',  Name: { Default: 'Other Allowances' }, IsVisible: true}
            ],
            ControlType: TotalRewardsControlEnum.Calculation
          } as CalculationControl, {
            Title: { Default: 'Your Total Rewards Value', Override: null },
            Layout: { Width: 12 },
            ControlType: TotalRewardsControlEnum.CalculationSummary
          } as BaseControl]
        }]
      }]
    }],
    CreatedById: 1,
  };
}

export function generateMockStatementWithSingleControl(controlType: TotalRewardsControlEnum, control: BaseControl): Statement {
  const statement = generateMockStatement();
  statement.Pages = [{
    Sections: [
      { Columns: [
          { Controls: [
              (control) ? control : { ControlType: controlType, Layout: {} }
            ]
          }]
      } as any
    ]
  }];
  return statement;
}

export function generateMockStatementWithSingleCalculationControl(): Statement {
  const statement = generateMockStatement();
  statement.Pages = [{
    Sections: [
      { Columns: [
          { Layout: {} as Layout,
            Controls: [
              {
                Id: '105',
                Title: { Default: 'Cash Compensation', Override: null },
                ControlType: TotalRewardsControlEnum.Calculation,
                Layout: { Width: 12 },
                Category: 'Compensation',
                Summary: { Default: 'Total', Override: null },
                DataFields: [
                  { Id: '1', DatabaseField: 'EmployeeBase', Name: { Default: 'Base Salary' }, IsVisible: true},
                  { Id: '2', DatabaseField: 'EmployeeBonus', Name: { Default: 'Bonus' }, IsVisible: true},
                  { Id: '3', DatabaseField: 'EmployeeSTI', Name: { Default: 'Short Term Incentive' }, IsVisible: true},
                  { Id: '4', DatabaseField: 'EmployeeLTI', Name: { Default: 'Long Term Incentive' }, IsVisible: true}
                ],
              } as CalculationControl
            ]
          }]
      }
    ]
  }];
  return statement;
}

export function generateMockStatementWithSingleCalculationControlAndNoVisibleFields(): Statement {
  const statement = generateMockStatementWithSingleCalculationControl();
  const calcControl = statement.Pages[0].Sections[0].Columns[0].Controls[0] as CalculationControl;

  calcControl.DataFields.forEach(f => f.IsVisible = false);
  statement.Pages[0].Sections[0].Columns[0].Controls[0] = calcControl;

  return statement;
}

export function generateMockStatementWithSingleCalculationControlUDFsOnly(): Statement {
  const statement = generateMockStatementWithSingleCalculationControl();
  const calcControl = statement.Pages[0].Sections[0].Columns[0].Controls[0] as CalculationControl;

  calcControl.DataFields = [
    { Id: '1', DatabaseField: 'UDF_CHAR_1', Name: { Default: 'Employee UDF 1', Override: null }, IsVisible: true, Type: 'EmployeesUdf',
      CanHaveEmployeeContribution: false},
    { Id: '2', DatabaseField: 'UDF_CHAR_2', Name: { Default: 'Employee UDF 2', Override: null }, IsVisible: true,  Type: 'EmployeesUdf',
      CanHaveEmployeeContribution: false}
    ];
  statement.Pages[0].Sections[0].Columns[0].Controls[0] = calcControl;

  return statement;
}
