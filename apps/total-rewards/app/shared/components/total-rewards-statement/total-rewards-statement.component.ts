import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import {
  CalculationControl,
  DeleteImageRequest,
  SaveImageRequest,
  Statement,
  StatementModeEnum,
  TotalRewardsControlEnum,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  UpdateStringPropertyRequest,
  UpdateTitleRequest
} from '../../models';

@Component({
  selector: 'pf-total-rewards-statement',
  templateUrl: './total-rewards-statement.component.html',
  styleUrls: ['./total-rewards-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalRewardsStatementComponent {

  @Input() statement: Statement;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() pageBreakAfter: boolean;

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

  get visibleCalculationControls(): CalculationControl[] {
    if (!this.statement) {
      return [];
    }

    const calcControls = [];
    this.statement.Pages.forEach(p => p.Sections.forEach(s => s.Columns.forEach(c => c.Controls.forEach(control => {
      if (control.ControlType === TotalRewardsControlEnum.Calculation) {
        const currentControl = control as CalculationControl;
        if (this.mode === StatementModeEnum.Edit) {
          calcControls.push(control);
        } else if (currentControl.DataFields.some(f =>
          this.employeeRewardsData[ f.DatabaseField ] !== null && f.IsVisible
        )) {
          calcControls.push(control);
        }
      }
    }))));
    return calcControls;
  }

  constructor() { }

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
