import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ControlType, AsyncStateObj } from 'libs/models';

import { TemplateNameAndStatusModel } from '../../models';
import * as fromCompanyControlReducer from '../../reducers';
import * as fromCompanyControlAction from '../../actions';

@Component({
  selector: 'pf-delete-company-control-modal',
  templateUrl: './delete-company-control-modal.component.html',
  styleUrls: ['./delete-company-control-modal.component.scss']
})
export class DeleteCompanyControlModalComponent implements OnInit, OnDestroy {
    @ViewChild('deleteCompanyControlModal', { static: true }) public deleteCompanyControlModal: any;

    private modalRef: NgbModalRef;
    private companyControl: ControlType;

    // Observables
    templatesWithControlType$: Observable<AsyncStateObj<TemplateNameAndStatusModel[]>>;
    deleteControlSuccess$: Observable<boolean>;
    deleteControlError$: Observable<boolean>;
    deleteControlErrorMessage$: Observable<string>;

    // Subscriptions
    deletingControlSuccessSubscription: Subscription;

    constructor(
        private modalService: NgbModal,
        private store: Store<fromCompanyControlReducer.State>
    ) {
        this.templatesWithControlType$ = this.store.pipe(select(fromCompanyControlReducer.getTemplateWithControlType));
        this.deleteControlError$ = this.store.pipe(select(fromCompanyControlReducer.getDeletingControlError));
        this.deleteControlErrorMessage$ = this.store.pipe(select(fromCompanyControlReducer.getDeletingControlErrorMessage));
        this.deleteControlSuccess$ = this.store.pipe(select(fromCompanyControlReducer.getDeletingControlSuccess));
    }

    ngOnInit(): void {
        this.deletingControlSuccessSubscription = this.deleteControlSuccess$.subscribe((success) => {
            if (success) {
                this.dismissModal();
            }
        });
    }

    open(controlType: ControlType) {
        this.store.dispatch(new fromCompanyControlAction.LoadTemplatesWithControlType({controlType: controlType.Type}));
        this.modalRef = this.modalService.open(this.deleteCompanyControlModal, { backdrop: 'static' });
        this.companyControl = controlType;
    }

    deleteConfirmed() {
       this.store.dispatch(new fromCompanyControlAction.DeleteControl({controlType: this.companyControl.Type}));
    }

    handleModalDismissed() {
      this.store.dispatch(new fromCompanyControlAction.CloseDeleteControlModal());
      this.dismissModal();
    }

    dismissModal() {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

    ngOnDestroy(): void {
        this.deletingControlSuccessSubscription.unsubscribe();
    }
}
