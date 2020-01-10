import { Component, Input, OnChanges } from '@angular/core';

import { ControlType } from 'libs/models';

import { JobDescriptionManagementService } from '../../../../shared/services';

@Component({
  selector: 'pf-company-control-preview',
  templateUrl: './company-control-preview.component.html',
  styleUrls: ['./company-control-preview.component.scss']
})
export class CompanyControlPreviewComponent implements OnChanges {

  @Input() controlType: ControlType;
  @Input() readOnly: boolean;

  private hideBody = false;
  public data: any[];

  constructor(
    private jobDescriptionManagementService: JobDescriptionManagementService
 ) { }

    toggleBody() {
        this.hideBody = !this.hideBody;
    }

    addDataRow(event: Event) {
        this.data.push(this.jobDescriptionManagementService.createDataRow(this.controlType.Attributes));
    }

    handleControlDataRowDeleted(removeDataRowObj: any) {
        this.data = this.data.filter(d => d.Id !== removeDataRowObj);
    }

    handleBulkDataChangesDetected(bulkDataChangeObj: any) {
        const sourcedAttribute = this.controlType.Attributes.find(a => a.CanBeSourced);

        const dataRows = bulkDataChangeObj.dataVals.map((d, index) => {
            const currentDataRow = bulkDataChangeObj.currentData[index];
            let dataRow;

            if (currentDataRow) {
                currentDataRow[sourcedAttribute.DisplayName] = d;
                dataRow = currentDataRow;
            } else {
                dataRow = this.jobDescriptionManagementService.createDataRow(this.controlType.Attributes, d);
                dataRow.Id += index;
            }

            return dataRow;
        });

        this.data = dataRows;
    }

    ngOnChanges(changes) {
        this.controlType = changes.controlType.currentValue;
        const value = changes.controlType.currentValue;
            this.data = [];
            if (value.Attributes !== null && value.Attributes.length > 0) {
                if (value.EditorType !== 'SmartList') {
                    this.data.push(this.jobDescriptionManagementService.createDataRow(value.Attributes));
                }
            }
    }

}
