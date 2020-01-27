import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { JobInformationField } from '../../../../shared/models';

@Component({
    selector: 'pf-template-job-information-section',
    templateUrl: './template-job-information-section.component.html',
    styleUrls: ['./template-job-information-section.component.scss']
})
export class TemplateJobInformationSectionComponent implements OnChanges {

    @Input() editing: boolean;
    @Input() availableJobInformationFieldsLoading: boolean;
    @Input() availableJobInformationFields: JobInformationField[];
    @Input() currentJobInformationFields: JobInformationField[];
    @Input() companyLogoPath: string;
    @Input() companyName: string;
    @Input() templateLogoPath: string;
    @Input() publicBaseUrl: string;
    @Output() fieldSelectorPopoverShown = new EventEmitter();
    @Output() fieldSelectorPopoverSaved = new EventEmitter();
    @Output() uploadLogoClicked = new EventEmitter();

    public hideBody = false;
    public jobInfoFieldRows: JobInformationField[];

    constructor() {}

    toggleBody() {
        this.hideBody = !this.hideBody;
    }

    handleFieldSelectorPopoverShown() {
        this.fieldSelectorPopoverShown.emit();
    }

    handleFieldSelectorPopoverSaved(jobInformationFields: JobInformationField[]) {
        this.fieldSelectorPopoverSaved.emit(jobInformationFields);
    }

    ngOnChanges(changes) {
        if (changes.currentJobInformationFields && changes.currentJobInformationFields.currentValue) {
            this.buildJobInfoFieldRows();
        }
    }

    upload() {
        this.uploadLogoClicked.emit();
    }

    private buildJobInfoFieldRows() {
        const rows = [];
        const jobInfoFields = this.currentJobInformationFields;

        jobInfoFields.forEach((jif, index) => {
            if (index % 2 === 0) {
                const lastInfoField = typeof jobInfoFields[index + 1] === 'undefined' ? { DisplayName: '', FieldName: '' }  : jobInfoFields[index + 1];
                rows.push({fields: [jobInfoFields[index], lastInfoField]});
            }
        });

        this.jobInfoFieldRows = rows;
    }
}
