import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';

import { State } from '@progress/kendo-data-query';

import { ControlLabel } from '../../shared/models/control-label.model';
import { AvailableJobInformationField } from '../../shared/models/available-job-information-field.model';
import { JobDescriptionViewConstants } from '../../shared/constants/job-description-view-constants';

@Component({
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

  export() {
    document.forms['bulkExportForm'].submit();
    this.p.close();
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

  ngOnChanges(changes: any) {
    if (changes.controlLabels && changes.controlLabels.currentValue) {
      if (this.viewSelected) {
        this.selectedControlLabelsAsString = this.stringify(this.controlLabels);
      }
    }
  }

  selectedJobInformationFieldsString(jobInfo: string) {
    this.selectedJobInformationFieldsAsString = jobInfo;
  }
}
