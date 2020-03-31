import {Component, Input, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  Statement,
  TotalRewardsControlEnum,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  UpdateStringPropertyRequest,
  UpdateTitleRequest,
  EmployeeRewardsData,
  StatementModeEnum
} from '../../models';

@Component({
  selector: 'pf-total-rewards-statement',
  templateUrl: './total-rewards-statement.component.html',
  styleUrls: ['./total-rewards-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalRewardsStatementComponent implements OnInit, OnDestroy {

  @Input() statement: Statement;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;

  // Common Outputs
  @Output() onControlTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();

  // Calculation Outputs
  @Output() onCalculationControlCompFieldTitleChange: EventEmitter<UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onCalculationControlSummaryTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCalculationControlCompFieldRemoved: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCalculationControlCompFieldAdded: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();

  // Rich Text Outputs
  @Output() onRichTextControlContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter<UpdateStringPropertyRequest>();

  controlType = TotalRewardsControlEnum;
  statementModeEnum = StatementModeEnum;

  // check statement.Settings.FontSize and return small-font | medium-font | large-font | ''
  get fontSizeCssClass(): string {
    if (this.statement && this.statement.Settings && this.statement.Settings.FontSize) {
      return this.statement.Settings.FontSize.toLowerCase() + '-font-size';
    }
    return '';
  }

  // check statement.Settings.FontFamily and return 'arial-font-family', 'times-new-roman-font-family', etc
  get fontFamilyCssClass(): string {
    if (this.statement && this.statement.Settings && this.statement.Settings.FontFamily) {
      return this.statement.Settings.FontFamily.toLowerCase().replace(/ /g, '-') + '-font-family';
    }
    return '';
  }

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
        { value: 40000, category: 'Base' },
        { value: 20000, category: 'Bonus' },
        { value: 5000, category: 'STI' },
        { value: 10000, category: 'LTI' },
        { value: 20000, category: 'Medical_Insurance' },
        { value: 20000, category: '401K_Savings_Match' }
      ],
      logoPath: 'https://vignette.wikia.nocookie.net/theoffice/images/0/02/Michael_Scott.jpg/revision/latest?cb=20170701090332'
    }
  ];

  private pageCountSubscription: Subscription;
  pageCount = 1;
  employeeArray = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // This is for POC employees/pages
    this.pageCountSubscription = this.route.queryParams.subscribe(params => {
      if (params['pages']) {
        this.pageCount = params['pages'];
      }
      for (let i = 0; i < this.pageCount; i++) {
        this.employeeArray.push(this.employeeData[i % 2]);
      }
    });
  }

  ngOnDestroy() {
    this.pageCountSubscription.unsubscribe();
  }

  getColumnWidth(count) {
    return 'col-' + (12 / count) + ' column';
  }

  getControlWidth(width) {
    return 'col-' + width;
  }

  // Common pass through methods
  handleOnControlTitleChange(event) {
    this.onControlTitleChange.emit(event);
  }

  // Calculation pass through methods
  handleOnCalculationControlCompFieldTitleChange(event) {
    this.onCalculationControlCompFieldTitleChange.emit(event);
  }

  handleOnCalculationControlSummaryTitleChange(event) {
    this.onCalculationControlSummaryTitleChange.emit(event);
  }

  handleOnCalculationControlCompFieldRemoved(event) {
    this.onCalculationControlCompFieldRemoved.emit(event);
  }

  handleOnCalculationControlCompFieldAdded(event) {
    this.onCalculationControlCompFieldAdded.emit(event);
  }

  // Rich Text pass through methods
  handleOnRichTextControlContentChange(event) {
    this.onRichTextControlContentChange.emit(event);
  }
}
