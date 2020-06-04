import { Component, ViewChild, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import { TemplateSection } from 'libs/models';

@Component({
    selector: 'pf-edit-section-modal',
    templateUrl: './edit-section-modal.component.html'
})
export class EditSectionModalComponent implements OnInit, OnChanges {
    @ViewChild('editTemplateSectionModal', {static: true}) public editTemplateSectionModal: any;

    @Input() templateSection: TemplateSection;
    @Output() editSectionComplete = new EventEmitter();

    private templateSectionForm: FormGroup;
    private modalRef: NgbModalRef;

    get templateSectionName() { return this.templateSectionForm.controls['templateSectionName']; }
    get templateSectionSubHeading() { return this.templateSectionForm.controls['templateSectionSubHeading']; }

    constructor(
        private formBuilder: FormBuilder,
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.editTemplateSectionModal, { backdrop: 'static' });
    }

    submit() {
        if (this.templateSectionForm.valid) {
            const templateSection: TemplateSection = cloneDeep(this.templateSection);
            templateSection.Name = this.templateSectionName.value;
            templateSection.SubHeading = this.templateSectionSubHeading.value;

            this.editSectionComplete.emit(templateSection);
            this.modalRef.close();
        }
    }

    buildForm() {
        this.templateSectionForm = this.formBuilder.group({
            'templateSectionName': ['', [Validators.required, Validators.maxLength(255)]],
            'templateSectionSubHeading': ['', Validators.maxLength(1000)]
        });
    }

    ngOnInit() {
        this.buildForm();
    }

    ngOnChanges(changes: any) {
        if (changes.templateSection && changes.templateSection.currentValue) {
            const value =  changes.templateSection.currentValue;
            if (value) {
                this.templateSectionForm.patchValue({
                    templateSectionName: value.Name,
                    templateSectionSubHeading: value.SubHeading
                }, {emitEvent: false});
            }
        }
    }
}
