import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pf-total-rewards-statement',
  templateUrl: './total-rewards-statement.component.html',
  styleUrls: ['./total-rewards-statement.component.scss']
})
export class TotalRewardsStatementComponent implements OnInit {

  companyColors = [
    '#1f2f3d',
    '#0883be',
    '#ffb300',
    '#dc1e34'
  ];

  employeeData = [
    {
      name: 'Employee 1',
      compensationData: [
        { value: 55, category: 'Base' },
        { value: 10, category: 'Bonus' },
        { value: 20, category: 'Healthcare' },
        { value: 5, category: '401K Match' }
        ],
      logoPath: 'https://images-na.ssl-images-amazon.com/images/I/41yf7iS-BML._SX355_.jpg'
    },
    {
      name: 'Employee 2',
      compensationData: [
        { value: 40, category: 'Base' },
        { value: 20, category: 'Bonus' },
        { value: 20, category: 'Healthcare' },
        { value: 20, category: '401K Match' }
      ],
      logoPath: 'https://vignette.wikia.nocookie.net/theoffice/images/0/02/Michael_Scott.jpg/revision/latest?cb=20170701090332'
    }
  ];

  templateObject = {
    templateName: 'Test Template',
    sectionCount: 2,
    sections: [
      {
        sectionName: 'Header',
        columnCount: 1,
        columns: [
          {
            columnName: 'Header',
            columnControls: [
              {
                controlName: 'Company Logo',
                controlType: 'Image',
                controlWidth: 4,
                controlData: 'https://images-na.ssl-images-amazon.com/images/I/41yf7iS-BML._SX355_.jpg'
              },
              {
                controlName: 'Total Rewards Statement',
                controlType: 'List',
                controlWidth: 8,
                controlData: [
                  'Dwight Schrute',
                  'Assistant to the Regional Manager',
                  'Scranton, PA',
                  'dschrute@schrutefarms.com'
                ]
              }
            ]
          }
        ]
      },
      {
        sectionName: 'Body',
        columnCount: 2,
        columns: [
          {
            columnName: 'Column 1',
            columnControls: [
              {
                controlName: 'Company Overview',
                showTitle: false,
                controlType: 'TextBox',
                controlWidth: 12,
                // tslint:disable-next-line:max-line-length
                controlData: 'Montes nascetur ridiculus mus mauris vitae. Et molestie ac feugiat sed lectus. Adipiscing bibendum est ultricies integer quis auctor elit. A iaculis at erat pellentesque adipiscing commodo elit. Vel pretium lectus quam id. Faucibus scelerisque eleifend donec pretium vulputate sapien nec. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Vestibulum lectus mauris ultrices eros in. In metus vulputate eu scelerisque felis imperdiet proin fermentum. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Euismod lacinia at quis risus sed vulputate. Diam volutpat commodo sed egestas egestas fringilla phasellus. Varius morbi enim nunc faucibus a pellentesque. Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Nisl pretium fusce id velit ut. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Ultricies mi eget mauris pharetra et ultrices neque ornare. Est sit amet facilisis magna etiam tempor. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Fermentum dui faucibus in ornare quam. Et tortor at risus viverra. Tempor nec feugiat nisl pretium fusce. Sit amet mauris commodo quis.'
              },
              {
                controlName: 'Rewards Breakdown',
                controlType: 'Chart',
                controlWidth: 12,
                controlData: [
                  { value: 55, category: 'Base' },
                  { value: 10, category: 'Bonus' },
                  { value: 20, category: 'Healthcare' },
                  { value: 5, category: '401K Match' }
                ]
              }
            ]
          },
          {
            columnName: 'Column 2',
            columnControls: [
              {
                controlName: 'Cash Compensation',
                controlType: 'Calc',
                controlWidth: 12,
                controlData: [
                  { value: 55, category: 'Base' },
                  { value: 10, category: 'Bonus' },
                  { value: 65, category: 'Total Cash Compensation Value' }
                ]
              },
              {
                controlName: 'Retirement & Savings',
                controlType: 'Calc',
                controlWidth: 12,
                controlData: [
                  { category: 'Retirement Savings', value: 12 },
                  { category: 'Total Retirement Savings', value: 12 }
                ]
              },
              {
                controlName: 'Health & Wellness',
                controlType: 'Calc',
                controlWidth: 12,
                controlData: [
                  { category: 'Medical Insurance', value: 0 },
                  { category: 'Dental Insurance', value: 0 },
                  { category: 'Vision Insurance', value: 0 },
                  { category: 'Total Benefits Value', value: 0 }
                ]
              }
            ]
          }
        ]
      }

    ]
  };

  private pageCountSubscription: Subscription;
  pageCount = 1;
  employeeArray = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.pageCountSubscription = this.route.queryParams.subscribe(params => {
      if (params['pages']) {
        this.pageCount = params['pages'];
      }
      console.log(this.pageCount);
      for (let i = 0; i < this.pageCount; i++) {
        this.employeeArray.push(this.employeeData[i % 2]);
      }
    });
  }

  getColumnWidth(count) {
    return 'col-' + (12 / count) + ' column';
  }

  getControlWidth(width) {
    return 'col-' + width;
  }
}
