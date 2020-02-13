import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ControlType } from 'libs/models';

import { CompanyControlEditableInfo } from '../../shared/models';
import * as fromCompanyControlDetailReducer from '../reducers';
import * as fromCompanyControlDetailAction from '../actions';
import { CompanyControlFormComponent, CompanyControlCopyModalComponent } from '../containers';
import { ConfirmEditCompanyControlModalComponent, DeleteCompanyControlOptionModalComponent } from '../components';

@Component({
  selector: 'pf-company-controls-detail',
  templateUrl: './company-controls-detail.page.html',
  styleUrls: ['./company-controls-detail.page.scss']
})
export class CompanyControlsDetailPageComponent implements OnInit, OnDestroy {
    @ViewChild(CompanyControlFormComponent, {static: true}) public companyControlForm: CompanyControlFormComponent;
    @ViewChild(ConfirmEditCompanyControlModalComponent, {static: true}) public confirmEditCompanyControlModal: ConfirmEditCompanyControlModalComponent;
    @ViewChild(DeleteCompanyControlOptionModalComponent, {static: true}) public deleteOptionModal: DeleteCompanyControlOptionModalComponent;
    @ViewChild(CompanyControlCopyModalComponent, {static: true}) public copyControlModal: CompanyControlCopyModalComponent;

    readOnly = true;
    editable = true;
    errorMessage = '';
    affectedJobs = 0;
    affectedTemplateNames: string[] = null;
    affectedJobsToDisplay: string[];

    // Observables
    private readonly$: Observable<boolean>;
    loading$: Observable<boolean>;
    controlType$: Observable<ControlType>;
    private controlEditableInfo$: Observable<CompanyControlEditableInfo>;
    saving$: Observable<boolean>;
    unhandledError$: Observable<boolean>;

    // Subscriptions
    editableInfoSubscription: Subscription;
    readonlySubscription: Subscription;

    constructor(private store: Store<fromCompanyControlDetailReducer.State>) {
        this.readonly$ = this.store.pipe(select(fromCompanyControlDetailReducer.getReadonly));
        this.loading$ = this.store.pipe(select(fromCompanyControlDetailReducer.getLoading));
        this.controlType$ = this.store.pipe(select(fromCompanyControlDetailReducer.getControlBeingViewed));
        this.controlEditableInfo$ = this.store.pipe(select(fromCompanyControlDetailReducer.getControlEditableInfo));
        this.saving$ = this.store.pipe(select(fromCompanyControlDetailReducer.getSaving));
        this.unhandledError$ = this.store.pipe(select(fromCompanyControlDetailReducer.getUnhandledrror));
    }

    ngOnInit() {
        this.readonlySubscription = this.readonly$.subscribe(r => { this.readOnly = r; });

        this.editableInfoSubscription = this.controlEditableInfo$.subscribe(e => {
            this.editable = e.IsEditable;
            this.errorMessage = e.ErrorMessage;
            this.affectedJobs = e.AffectedJobs;
            this.affectedTemplateNames = e.AffectedTemplateNames;
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(new fromCompanyControlDetailAction.CloseCompanyControlsDetailView());

        this.readonlySubscription.unsubscribe();
        this.editableInfoSubscription.unsubscribe();
    }

    createNewControl() {
        this.companyControlForm.onSubmit(true);
    }

    saveEditedControl() {
        (this.affectedTemplateNames != null && this.affectedTemplateNames.length > 0)
            ? this.showConfirmEditCompanyControlModal()
            : this.handleEditCompanyControlConfirmed();
    }

    handleEditCompanyControlConfirmed() {
        this.companyControlForm.onSubmit(false);
    }

    handleControlSubmitted(control: ControlType) {
        if (control.ControlVersion > 1) {
            this.store.dispatch(new fromCompanyControlDetailAction.SaveEditedControlType(control));
        } else {
            this.store.dispatch(new fromCompanyControlDetailAction.SaveControl(control));
        }
    }

    close() {
        this.store.dispatch(new fromCompanyControlDetailAction.CloseCompanyControlsDetailView());
    }

    showConfirmEditCompanyControlModal() {
        this.confirmEditCompanyControlModal.open();
    }

    showConfirmDeleteControlOptionModal(affectedJobs: string[]) {
        this.deleteOptionModal.open(affectedJobs);
    }

    copyControl() {
        this.copyControlModal.open();
    }

    handleCopyCompanyControl(newControlName: string) {
        this.readOnly = false;
        this.editable = true;
        this.errorMessage = '';
        this.affectedJobs = 0;
        this.affectedTemplateNames = null;

        this.companyControlForm.enabledForms();
        this.store.dispatch(new fromCompanyControlDetailAction.ChangeControlName({controlName: newControlName}));
    }

    handleControlOptionDeleteClick(event$: any) {
        this.showConfirmDeleteControlOptionModal(event$.affectedJobs);
    }
}
