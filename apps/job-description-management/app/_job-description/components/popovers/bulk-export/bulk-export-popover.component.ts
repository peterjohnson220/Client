import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { ControlLabel } from '../../../../shared/models/control-label.model';
import { AvailableJobInformationField } from '../../../../shared/models/available-job-information-field.model';
import { JobDescriptionViewConstants } from '../../../../shared/constants/job-description-view-constants';
import { JobDescriptionBulkExportPayload } from '../../../models/job-description-bulk-export-payload.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pf-bulk-export-popover',
  templateUrl: './bulk-export-popover.component.html',
  styleUrls: ['./bulk-export-popover.component.scss']
})

export class BulkExportPopoverComponent implements OnChanges {
  @ViewChild('p', { static: true }) public p: any;

  public selectedControlLabels: ControlLabel[] = [];
  public selectedControlLabelsAsString: string;
  public gridStateAsString: string;
  public viewSelected = false;
  public viewNameString = '';
  public allJobInformationFieldsSelected = false;
  public jobInformationFieldsDisplay = false;
  public selectedJobInformationFieldsAsString: string;
  public jobInformationFieldSelected = false;
  public selectedStatusesToExport: string[];
  public includeHtmlFormatting = false;
  public jobDescriptionBulkExportPayload: JobDescriptionBulkExportPayload;


  @Input() controlLabels: ControlLabel[];
  @Input() controlLabelsLoading: boolean;
  @Input() listFilterValue: string;
  @Input() gridState: State;
  @Input() noPublishedJobDescriptions: boolean;
  @Input() jobDescriptionListViews: string[];
  @Input() jobDescriptionListViewsLoading: boolean;
  @Input() jobInformationFields: AvailableJobInformationField[];
  @Input() jobInformationFieldsLoading: boolean;

  @Output() open = new EventEmitter();
  @Output() viewSelectionChanged = new EventEmitter();
  @Output() exported = new EventEmitter();



  export() {
    this.exportLogic();
    this.p.close();
  }

  exportLogic() {
    this.jobDescriptionBulkExportPayload = {
      Query: this.listFilterValue,
      ViewName: this.viewNameString,
      IncludeHtmlFormatting: this.includeHtmlFormatting,
      Controls: this.selectedControlLabels,
      ListState: JSON.parse(this.gridStateAsString),
      AvailableJobInformationFields: JSON.parse(this.selectedJobInformationFieldsAsString),
      Statuses: this.selectedStatusesToExport
    };

    this.exported.emit(this.jobDescriptionBulkExportPayload);
  }

  toggleControlLabel(event) {
    const controlLabelObj = JSON.parse(event.target.dataset.controlLabel);

    if (event.target.checked) {
      this.selectedControlLabels.push(controlLabelObj);
    } else {
      this.selectedControlLabels = this.selectedControlLabels.filter(cl =>
        !(cl.Label === controlLabelObj.Label && cl.TemplateId === controlLabelObj.TemplateId));
    }

    this.selectedControlLabelsAsString = this.stringify(this.selectedControlLabels);
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  handlePopoverShown() {
    this.selectedControlLabels = [];
    this.gridStateAsString = this.stringify(this.gridState);
    this.viewSelected = false;
    this.viewNameString = '';
    this.jobInformationFieldsLoading = true;
    this.selectedStatusesToExport = ['Published'];
    this.includeHtmlFormatting = false;
  }

  handleViewChanged(view: string) {
    if (view !== 'Default') {
      this.viewSelected = true;
      this.viewNameString = view;
    } else {
      this.selectedControlLabels = [];
      this.viewSelected = false;
      this.viewNameString = '';
    }
    this.viewSelectionChanged.emit(this.viewNameString);
  }

  isUserDefinedViewsAvailable() {
    return this.jobDescriptionListViews.length > JobDescriptionViewConstants.SYSTEM_VIEWS.length - 1;
  }

  isExportButtonDisabled(): boolean {
      return !this.selectedControlLabels.length && !this.viewSelected ||
      (this.viewSelected && !this.controlLabels.length) ||
      (!this.selectedJobInformationFieldsAsString || this.selectedJobInformationFieldsAsString.length === 0) ||
      (!this.selectedStatusesToExport.length);
  }

  ngOnChanges(changes: any) {
    if (changes.controlLabels && changes.controlLabels.currentValue) {
      if (this.viewSelected) {
        this.selectedControlLabelsAsString = this.stringify(this.controlLabels);
        this.selectedControlLabels = this.controlLabels;
      }
    }
  }

  selectedJobInformationFieldsString(jobInfo: string) {
    this.selectedJobInformationFieldsAsString = jobInfo;
  }

  handleExportStatusClick({ target }) {
    // this is to avoid an "object is not extensible" error that pops up on occasion
    // this.selectedStatusesToExport = cloneDeep(this.selectedStatusesToExport);
    if (target.checked) {
      this.selectedStatusesToExport.push(target.value);
    } else {
      this.selectedStatusesToExport = this.selectedStatusesToExport.filter(x => x !== target.value);
    }
  }


}
