import { Component, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ControlType } from 'libs/models';

import * as fromCompanyControlDetailReducer from '../../reducers';
import { CompanyControlHeaderComponent } from '../../components';
import { CompanyControlLayoutComponent } from '../company-control-layout';

@Component({
    selector: 'pf-company-control-form',
    templateUrl: './company-control-form.component.html',
    styleUrls: ['./company-control-form.component.scss']

})
export class CompanyControlFormComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(CompanyControlLayoutComponent, { static: true }) public layoutControl: CompanyControlLayoutComponent;
    @ViewChild(CompanyControlHeaderComponent, { static: true }) public headerControl: CompanyControlHeaderComponent;

    @Input() controlType: ControlType;
    @Input() readOnly: boolean;
    @Input() editable: boolean;
    @Input() errorMessage: string;
    @Output() controlSubmitted = new EventEmitter();
    @Output() controlOptionDeleteClick = new EventEmitter();

    private savingErrorMessage$: Observable<string>;

    private errorMessageSubscription: Subscription;

    public controlSaveObj: ControlType;
    isNew: boolean;

    constructor(private store: Store<fromCompanyControlDetailReducer.State>) {
        this.savingErrorMessage$ = this.store.pipe(select(fromCompanyControlDetailReducer.getSavingErrorMessage));
    }

    ngOnChanges(changes) {
        if (changes.controlType && changes.controlType.currentValue) {
            this.updateControlTypeAndAttributes();
        }
    }

    ngOnInit() {
        this.errorMessageSubscription = this.savingErrorMessage$.subscribe(em => this.headerControl.name.setErrors({'error': em}));
    }

    onSubmit(isNew: boolean) {
        this.layoutControl.submitted = true;
        this.headerControl.submitted = true;

        if (this.layoutControl.isValid && this.headerControl.isValid) {
            this.controlSaveObj = this.headerControl.formValue;
            this.controlSaveObj.Attributes = this.layoutControl.formValue;

            if (isNew) {
                this.layoutControl.updateAttributeNames(this.controlSaveObj);
                this.controlSaveObj.IsLatest = true;
                this.controlSaveObj.ControlVersion = 1;
            } else {
                this.incrementControlVersion();
            }

            this.controlSubmitted.emit(this.controlSaveObj);
        } else {
            // Kendo Controls require that they be touched
            // in order to see the red border on the control
            // when its invalid
            this.layoutControl.markFormGroupTouched(this.layoutControl.layoutForm);
            this.headerControl.markFormGroupTouched(this.headerControl.headerForm);
        }
    }

    incrementControlVersion() {
        this.controlSaveObj.ControlVersion = this.controlSaveObj.ControlVersion + 1;
    }

    updateControlTypeAndAttributes() {
        this.controlSaveObj = this.headerControl.formValue;
        this.controlSaveObj.Attributes = this.layoutControl.formValue;
    }

    handleEditorTypeChange(editorType: string) {
        this.layoutControl.handleEditorTypeChange(editorType);
    }

    handleCanEditTemplateDataChanged(canEditTemplateData: boolean) {
        this.layoutControl.canEditTemplateData = canEditTemplateData;
    }

    handleControlOptionDeleteClick($event) {
        this.controlOptionDeleteClick.emit($event);
    }

    handleControlTypeChange() {
        this.updateControlTypeAndAttributes();
    }

    handleAttributeChange() {
        this.updateControlTypeAndAttributes();
    }

    enabledForms() {
        this.headerControl.headerForm.enable();
        this.layoutControl.layoutForm.enable();
    }

    ngOnDestroy() {
        this.errorMessageSubscription.unsubscribe();
    }
}
