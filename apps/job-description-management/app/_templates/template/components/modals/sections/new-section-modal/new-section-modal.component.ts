import { Component, ViewChild, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pf-new-section-modal',
    templateUrl: './new-section-modal.component.html'
})
export class NewSectionModalComponent implements OnInit {

    @ViewChild('newTemplateSectionModal', {static: false}) public newTemplateSectionModal: any;
    @Output() addSectionComplete = new EventEmitter();

    private templateSectionForm: FormGroup;
    private modalRef: NgbModalRef;

    get templateSectionName() { return this.templateSectionForm.controls['templateSectionName']; }
    get templateSectionSubHeading() { return this.templateSectionForm.controls['templateSectionSubHeading']; }

    constructor(
        private formBuilder: FormBuilder,
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.newTemplateSectionModal, { backdrop: 'static' });
    }

    close() {
        if (this.templateSectionForm) {
            this.templateSectionForm.reset();
        }
        this.modalService.dismissAll();
    }

    submit() {
        if (this.templateSectionForm.valid) {
            this.addSectionComplete.emit(this.templateSectionForm.value);
            this.close();
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
}
