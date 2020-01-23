import { Component, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';

import { AbstractBaseDataViewModal } from '../../../_shared/containers';
import { BaseDataView } from '../../../_shared/models';
import * as fromSharedReducer from '../../../_shared/reducers';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';

@Component({
  selector: 'pf-create-data-view-modal',
  templateUrl: './create-data-view-modal.component.html'
})
export class CreateDataViewModalComponent extends AbstractBaseDataViewModal {
  @ViewChild('createDataViewModal', { static: true }) public createDataViewModal: any;

  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    sharedStore: Store<fromSharedReducer.State>,
    private dataInsightsPageStore: Store<fromDataInsightsMainReducer.State>
  ) {
    super(modalService, formBuilder, sharedStore);
    this.saving$ = this.dataInsightsPageStore.pipe(select(fromDataInsightsMainReducer.getSavingUserReport));
    this.savingError$ = this.dataInsightsPageStore.pipe(select(fromDataInsightsMainReducer.getSaveUserReportError));
    this.savingConflict$ = this.dataInsightsPageStore.pipe(select(fromDataInsightsMainReducer.getSaveUserReportConflict));
  }

  open(): void {
    this.resetForm();
    this.modalService.open(this.createDataViewModal, { backdrop: 'static', centered: true });
  }

  save(): void {
    const baseDataView: BaseDataView = this.createBaseDataView();
    this.store.dispatch(new fromDataViewActions.SaveUserReport(baseDataView));
    this.showErrorMessages = true;
  }

  private resetForm(): void {
    this.baseDataViewForm.patchValue({
      entity: this.defaultEntity,
      name: '',
      summary: ''
    });
  }

}
