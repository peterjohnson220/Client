import { Component, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';

import { UserDataView } from 'libs/features/formula-editor';

import { AbstractBaseDataViewModal } from '../../../_shared/containers';
import * as fromSharedReducer from '../../../_shared/reducers';
import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';

@Component({
  selector: 'pf-edit-data-view-modal',
  templateUrl: './edit-data-view-modal.component.html'
})
export class EditDataViewModalComponent extends AbstractBaseDataViewModal implements OnChanges {
  @Input() userDataView: UserDataView;

  @ViewChild('editDataViewModal', { static: true }) public editDataViewModal: any;

  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    sharedStore: Store<fromSharedReducer.State>,
    private dataViewPageStore: Store<fromDataViewMainReducer.State>
  ) {
    super(modalService, formBuilder, sharedStore);
    this.saving$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getEditingUserReport));
    this.savingError$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getEditUserReportError));
    this.savingConflict$ = this.dataViewPageStore.pipe(select(fromDataViewMainReducer.getEditUserReportConflict));
  }

  open(): void {
    this.modalService.open(this.editDataViewModal, { backdrop: 'static', centered: true });
  }

  save(): void {
    const userDataView: UserDataView = this.createUserDataView();
    this.store.dispatch(new fromDataViewActions.EditUserReport(userDataView));
    this.showErrorMessages = true;
  }

  updateForm(): void {
    if (!!this.userDataView && !!this.baseDataViewForm) {
      this.reportName = this.userDataView.Name;
      this.summary = this.userDataView.Summary;
      this.baseDataViewForm.patchValue({
        entity: this.userDataView.Entity,
        name: this.userDataView.Name,
        summary: this.userDataView.Summary
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  private createUserDataView(): UserDataView {
    return {
      ...this.userDataView,
      Name: this.baseDataViewForm.value.name,
      Summary: this.baseDataViewForm.value.summary
    };
  }

}
