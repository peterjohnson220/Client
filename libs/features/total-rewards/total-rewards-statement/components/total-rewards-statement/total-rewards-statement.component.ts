import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { Page } from '../../models/page';

import {
  CalculationControl,
  CompensationField,
  DeleteImageRequest,
  SaveImageRequest,
  Statement,
  StatementModeEnum,
  TotalRewardsControlEnum,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  ReorderCalcControlFieldsRequest,
  UpdateStringPropertyRequest,
  UpdateUdfsInRteContentRequest,
  UpdateTitleRequest
} from '../../models';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';

@Component({
  selector: 'pf-total-rewards-statement',
  templateUrl: './total-rewards-statement.component.html',
  styleUrls: ['./total-rewards-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalRewardsStatementComponent {

  @Input() loadingData: boolean;
  @Input() statement: Statement;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() pageBreakAfter: boolean;
  @Input() companyUdfs: CompensationField[];
  @Input() visibleFieldsCount: number;
  @Input() activeEditorId: string;
  @Input() isPageScrolling: boolean;
  @Input() isAdditionalPageEnabled: boolean;

  // Common Outputs
  @Output() onControlTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();

  // Calculation Outputs
  @Output() onCalculationControlCompFieldTitleChange: EventEmitter<UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onCalculationControlSummaryTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCalculationControlCompFieldRemoved: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCalculationControlCompFieldAdded: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCalculationControlCompFieldReordered: EventEmitter<ReorderCalcControlFieldsRequest> = new EventEmitter();

  // Rich Text Outputs
  @Output() onRichTextControlContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter<UpdateStringPropertyRequest>();
  @Output() onRichTextControlUdfsInContentChange: EventEmitter<UpdateUdfsInRteContentRequest> = new EventEmitter<UpdateUdfsInRteContentRequest>();
  @Output() onRTEFocusChange: EventEmitter<string> = new EventEmitter();

  // Chart Control Outputs
  @Output() onChartControlToggleSettingsPanelClick = new EventEmitter();
  @Output() onChartControlRender: EventEmitter<string> = new EventEmitter();

  // Image Control Outputs
  @Output() onSaveImage: EventEmitter<SaveImageRequest> = new EventEmitter();
  @Output() onRemoveImage: EventEmitter<DeleteImageRequest> = new EventEmitter();
  @Output() onImageLoaded: EventEmitter<string> = new EventEmitter();
  @Output() onImageSelected: EventEmitter<void> = new EventEmitter();

  // Effective Date Outputs
  @Output() onEffectiveDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  controlType = TotalRewardsControlEnum;
  statementModeEnum = StatementModeEnum;

  get cssClasses(): string {
    return `${this.templateSpecificCss} ${this.fontSizeCssClass} ${this.fontFamilyCssClass} ${this.additionalPageCss}`;
  }

  get templateSpecificCss(): string {
    switch (this.statement.TemplateName.toLowerCase()) {
      case 'simple':
        return 'pf-simple-template';
      case 'styled':
        return 'pf-styled-template';
      default:
        return '';
    }
  }

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

  // this and it's reference in cssClasses can be removed when the launch darkly additional page flag is deprecated
  get additionalPageCss(): string {
    return this.isAdditionalPageEnabled ? '' : 'additional-page-disabled';
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
        } else if (this.isCalcControlVisible(currentControl.DataFields)) {
          calcControls.push(control);
        }
      }
    }))));
    return calcControls;
  }

  isCalcControlVisible(dataFields: CompensationField[]): boolean {
    return dataFields.some(f => {
      if (!f.IsVisible) {
        return false;
      } else if (f.Type) {
        return TotalRewardsStatementService.getUdfAsNumeric(this.employeeRewardsData, f.Type, f.DatabaseField) > 0;
      }

      const checkEmployeeContributions = this.statement.Settings.DisplaySettings.ShowEmployeeContributions && f.CanHaveEmployeeContribution;
      return TotalRewardsStatementService.doesEmployeeRewardsFieldHaveData(f.DatabaseField, this.employeeRewardsData) ||
        TotalRewardsStatementService.doesBenefitFieldHaveData(f.DatabaseField, this.employeeRewardsData, checkEmployeeContributions);
    });
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

  handleOnCalculationControlCompFieldReordered(event) {
    this.onCalculationControlCompFieldReordered.emit(event);
  }

  // Rich Text pass through methods
  handleOnRichTextControlContentChange(event) {
    this.onRichTextControlContentChange.emit(event);
  }

  handleOnRichTextControlUdfsInContentChange(event) {
    this.onRichTextControlUdfsInContentChange.emit(event);
  }

  handleOnRTEFocusChange(event) {
    this.onRTEFocusChange.emit(event);
  }

  // Chart pass through methods
  handleChartControlSettingsClick() {
    this.onChartControlToggleSettingsPanelClick.emit();
  }

  handleChartRender() {
    this.onChartControlRender.emit();
  }

  // Image pass though methods
  handleSaveImage(event) {
    this.onSaveImage.emit(event);
  }

  handleRemoveImage(deleteImageRequest) {
    this.onRemoveImage.emit(deleteImageRequest);
  }

  handleImageLoaded(imageControlId) {
    this.onImageLoaded.emit(imageControlId);
  }

  handleImageSelected() {
    this.onImageSelected.emit();
  }

  // Effective Date pass through methods
  handleEffectiveDateChange(date: Date) {
    this.onEffectiveDateChange.emit(date);
  }

  // track which item each ngFor is on, which no longer necessitates destroying/creating all components in state changes and improves perf significantly
  trackByFn(index: number, item: any) {
    return index;
  }
}
