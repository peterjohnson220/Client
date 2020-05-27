import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subscription} from 'rxjs';

import {
  Statement,
  TotalRewardsControlEnum,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  UpdateStringPropertyRequest,
  UpdateTitleRequest,
  EmployeeRewardsData,
  StatementModeEnum,
  CalculationControl,
  SaveImageRequest,
  DeleteImageRequest
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

  // Chart Control Outputs
  @Output() onChartControlToggleSettingsPanelClick = new EventEmitter();

  // Image Control Outputs
  @Output() onSaveImage: EventEmitter<SaveImageRequest> = new EventEmitter();
  @Output() onRemoveImage: EventEmitter<DeleteImageRequest> = new EventEmitter();

  // Effective Date Outputs
  @Output() onEffectiveDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  controlType = TotalRewardsControlEnum;
  employees = [1];
  employeeCountSubscription = new Subscription();

  // check statement.Settings.FontSize and return small-font-size | medium-font-size | large-font-size | ''
  get fontSizeCssClass(): string {
    if (this.statement && this.statement.Settings && this.statement.Settings.FontSize) {
      return this.statement.Settings.FontSize.toLowerCase() + '-font-size';
    }
    return '';
  }

  // check statement.Settings.FontFamily and return 'arial-font-family' | 'times-new-roman-font-family', etc
  get fontFamilyCssClass(): string {
    if (this.statement && this.statement.Settings && this.statement.Settings.FontFamily) {
      return this.statement.Settings.FontFamily.toLowerCase().replace(/ /g, '-') + '-font-family';
    }
    return '';
  }

  get calculationControls(): CalculationControl[] {
    if (!this.statement) {
      return [];
    }

    const calcControls = [];
    this.statement.Pages.forEach(p => p.Sections.forEach(s => s.Columns.forEach(c => c.Controls.forEach(control => {
      if (control.ControlType === TotalRewardsControlEnum.Calculation) {
        calcControls.push(control);
      }
    }))));

    return calcControls;
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // This is for POC employees/pages
    this.employeeCountSubscription = this.route.queryParams.subscribe(params => {
      if (params['pages']) {
        for (let i = 2; i <= params['pages']; i++) {
          this.employees.push(i);
        }
      }
    });
  }

  ngOnDestroy() {
    this.employeeCountSubscription.unsubscribe();
  }

  // track which item each ngFor is on, which no longer necessitates destroying/creating all components in state changes and improves perf significantly
  trackByFn(index: number, item: any) {
    return index;
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

  // Chart pass through methods
  handleChartControlSettingsClick() {
    this.onChartControlToggleSettingsPanelClick.emit();
  }

  // Image pass though methods
  handleSaveImage(event) {
    this.onSaveImage.emit(event);
  }

  handleRemoveImage(deleteImageRequest) {
    this.onRemoveImage.emit(deleteImageRequest);
  }

  // Effective Date pass through methods
  handleEffectiveDateChange(date: Date) {
    this.onEffectiveDateChange.emit(date);
  }
}
