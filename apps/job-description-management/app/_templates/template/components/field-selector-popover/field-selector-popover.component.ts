import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';

import { JobInformationField, AvailableJobInformationField } from 'libs/features/job-description-management';

@Component({
    selector: 'pf-template-job-info-field-selector-popover',
    templateUrl: './field-selector-popover.component.html',
    styleUrls: ['./field-selector-popover.component.scss']
})

export class FieldSelectorPopoverComponent implements OnChanges {
    private nonDefaultAvailableJobInfoFields: any[];
    private selectedNonDefaultJobInfoFields: JobInformationField[];

    constructor() {}

    @Input() loading: boolean;
    @Input() availableJobInformationFields: AvailableJobInformationField[];
    @Input() currentJobInformationFields: JobInformationField[];
    @Output() opened = new EventEmitter();
    @Output() saved = new EventEmitter();

    @ViewChild('p', {static: true}) public p: any;

    save() {
        const defaultFields = this.availableJobInformationFields.filter(ajif => ajif.IsDefault)
            .map(f => this.mapToJobInformationField(f));

        const newJobInfoFields = defaultFields.concat(this.selectedNonDefaultJobInfoFields);

        this.p.close();
        this.saved.emit(newJobInfoFields);
    }

    fieldSelected(event) {
        const target = event.target;

        if (target.checked) {
            this.selectedNonDefaultJobInfoFields.push(
                this.nonDefaultAvailableJobInfoFields
                    .map(f => this.mapToJobInformationField(f))
                    .find(f => f.FieldName === target.value));
        } else {
            this.selectedNonDefaultJobInfoFields = this.selectedNonDefaultJobInfoFields.filter(f => f.FieldName !== target.value);
        }
    }

    handlePopoverShown() {
        this.opened.emit();
    }

    isCurrentJobInformationField(fieldName: string) {
        return this.currentJobInformationFields.find(f => f.FieldName === fieldName);
    }

    ngOnChanges(changes) {
        const availableJobInformationFields = changes.availableJobInformationFields;

        if (availableJobInformationFields && availableJobInformationFields.currentValue.length) {
            this.selectedNonDefaultJobInfoFields = [];

            this.nonDefaultAvailableJobInfoFields = availableJobInformationFields.currentValue
                .filter(f => !f.IsDefault)
                .map(f => {
                        return {
                            DisplayName: f.DisplayName,
                            FieldName: f.FieldName,
                            Checked: this.isCurrentJobInformationField(f.FieldName)
                        };
                    }
                );

            this.nonDefaultAvailableJobInfoFields.forEach(f => {
                if (f.Checked) {
                    this.selectedNonDefaultJobInfoFields.push(this.mapToJobInformationField((f)));
                }
            });
        }
    }

    private mapToJobInformationField(field): JobInformationField {
        return {
            FieldName: field.FieldName,
            DisplayName: field.DisplayName,
            FieldValue: null
        };
    }
}
