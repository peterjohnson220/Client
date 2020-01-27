import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateControl, ControlType } from 'libs/models';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';

@Component({
    selector: 'pf-upsert-control-modal',
    templateUrl: 'upsert-control-modal.component.html',
    styleUrls: ['upsert-control-modal.component.scss']
})

export class UpsertControlModalComponent implements OnInit {
    @ViewChild('labelControlTypeModal', {static: true}) public labelControlTypeModal: any;
    @Input() templateId: number;
    @Output() controlAdditionalPropertiesChangesDetected = new EventEmitter();

    public submitted = false;
    private controlLabelForm: FormGroup;
    private populatedControlLabel: string;
    private saveCallbackFn: any;
    private modalRef: NgbModalRef;
    private invalidControlLabel: boolean;
    private editing: boolean;
    private templateControl: TemplateControl;
    private additionalProperties: any;
    private showControlName: boolean;
    private showControlLabelCheckbox: boolean;
    private outgoingAdditionalProperties: any;

    get getControlLabel() { return this.controlLabelForm.controls['controlLabel']; }

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
    ) { }

    open(populatedControlLabel: string, saveCallbackFn: any, editing: boolean, templateControl: TemplateControl, companyControl: ControlType) {
        this.controlLabelForm.reset();
        this.templateControl = templateControl;
        this.showControlLabelCheckbox = this.showCheckBoxOnCondition(templateControl, companyControl);
        this.showControlName = this.setFromAdditionalProperties(templateControl);
        this.populatedControlLabel = populatedControlLabel;
        this.getControlLabel.setValue(this.populatedControlLabel);
        this.saveCallbackFn = saveCallbackFn;
        this.editing = editing;
        this.additionalProperties = null;
        this.outgoingAdditionalProperties = null;
        this.modalRef = this.modalService.open(this.labelControlTypeModal, { backdrop: 'static' });
    }

    close() {
        this.submitted = false;
        this.modalRef.close();
    }

    submit() {

        this.submitted = true;

        if (this.showControlLabelCheckbox && this.templateControl != null) {
            this.outgoingAdditionalProperties = this.handleAdditionalPropertiesChangesOnSubmit(this.showControlName);
        }

        const controlLabelValue = this.getControlLabel.value;

        if (this.editing && controlLabelValue === this.populatedControlLabel) {
            this.close();
        } else {
            this.jobDescriptionTemplateApiService.controlLabelExists(this.templateId, controlLabelValue).subscribe((result: boolean) => {
                this.invalidControlLabel = result;
                this.submitted = !result;
                if (!this.invalidControlLabel) {
                    if (this.showControlLabelCheckbox) {
                        // Happens when dragging and dropping a control into a section
                        this.outgoingAdditionalProperties = { ShowControlName: this.showControlName };
                        this.saveCallbackFn(controlLabelValue, this.outgoingAdditionalProperties);
                        this.close();
                    } else {
                        // Happens when control already exists.
                        this.saveCallbackFn(controlLabelValue, null);
                        this.close();
                    }
                }
            });
        }
    }

    buildForm() {
        this.controlLabelForm = this.formBuilder.group({
            'controlLabel': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]]
        });
    }

    ngOnInit() {
        this.buildForm();

        this.controlLabelForm.valueChanges.subscribe((change) => {
            this.invalidControlLabel = false;
        });
    }

    handleAdditionalPropertiesChangesOnSubmit(eventArgs: boolean) {
        this.controlAdditionalPropertiesChangesDetected.emit({ control: this.templateControl, additionalProperties: { ShowControlName: eventArgs }});
        return { ShowControlName: eventArgs };
    }

    showCheckBoxOnCondition(templateControl: TemplateControl, companyControl: ControlType) {
        if (this.setFromAdditionalProperties(templateControl)) {
            return true;
        } else if (companyControl != null
          && (companyControl.EditorType === 'Single' || companyControl.EditorType === 'SmartList' || companyControl.EditorType === 'List')
          && companyControl.Attributes !== null
          && (companyControl.Attributes[0].Type === 'RichText' || companyControl.Attributes[0].Type === 'Textbox'
          || companyControl.Attributes[0].Type === 'Rendered' || companyControl.Attributes[0].Type === 'Textarea'
          || companyControl.Attributes[0].Type === 'Dropdown' || companyControl.Attributes[0].Type === 'RadioButton')) {
            return true;
        }
        return false;
    }

    setFromAdditionalProperties(templateControl: TemplateControl) {
        if (templateControl != null && templateControl.AdditionalProperties != null) {
            this.additionalProperties = templateControl.AdditionalProperties;
            if (this.additionalProperties.ShowControlName) {
                return true;
            }
        }
        return false;
    }
}
