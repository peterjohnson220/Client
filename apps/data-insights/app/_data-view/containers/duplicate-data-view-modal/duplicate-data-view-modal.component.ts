import { Component, ViewChild, Input } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';

import { AbstractBaseDataViewModal } from '../../../_shared/containers';
import * as fromSharedReducer from '../../../_shared/reducers';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { UserDataView } from '../../models';

@Component({
  selector: 'pf-duplicate-data-view-modal',
  templateUrl: './duplicate-data-view-modal.component.html'
})
export class DuplicateDataViewModalComponent extends AbstractBaseDataViewModal {
  @Input() userDataView: UserDataView;

  @ViewChild('duplicateDataViewModal', { static: true }) public duplicateDataViewModal: any;

  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    sharedStore: Store<fromSharedReducer.State>,
    private dataViewPageStore: Store<fromDataViewMainReducer.State>
  ) {
    super(modalService, formBuilder, sharedStore);
    this.saving$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getDuplicatingUserReport));
    this.savingError$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getDuplicateUserReportError));
    this.savingConflict$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getDuplicateUserReportConflict));
  }

  open(): void {
    this.modalService.open(this.duplicateDataViewModal, { backdrop: 'static', centered: true });
  }

  save(): void {
    const userDataView: UserDataView = this.createUserDataView();
    this.store.dispatch(new fromDataViewActions.DuplicateUserReport(userDataView));
    this.showErrorMessages = true;
  }

  updateForm(): void {
    if (!!this.userDataView && !!this.baseDataViewForm) {
      this.reportName = `Copy of ${this.userDataView.Name}`;
      this.summary = this.userDataView.Summary;
      this.baseDataViewForm.patchValue({
        entity: this.userDataView.Entity,
        name: `Copy of ${this.userDataView.Name}`,
        summary: this.userDataView.Summary
      });
    }
  }

  private createUserDataView(): UserDataView {
    return {
      ...this.userDataView,
      Name: this.baseDataViewForm.value.name,
      Summary: this.baseDataViewForm.value.summary,
      SortField: this.userDataView.SortField,
      SortDir: this.userDataView.SortDir
    };
  }

}
