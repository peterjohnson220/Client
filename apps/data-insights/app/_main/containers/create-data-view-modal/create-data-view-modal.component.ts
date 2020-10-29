import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntlService } from '@progress/kendo-angular-intl';

import { BaseDataView, Entity, EntityData, FieldDataType } from 'libs/features/formula-editor';

import { AbstractBaseDataViewModal } from '../../../_shared/containers';
import * as fromSharedReducer from '../../../_shared/reducers';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';

@Component({
  selector: 'pf-create-data-view-modal',
  templateUrl: './create-data-view-modal.component.html'
})
export class CreateDataViewModalComponent extends AbstractBaseDataViewModal implements OnChanges {
  @ViewChild('createDataViewModal', { static: true }) public createDataViewModal: any;

  activeEntity: Entity;
  max: Date = new Date();
  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    sharedStore: Store<fromSharedReducer.State>,
    private dataInsightsPageStore: Store<fromDataInsightsMainReducer.State>,
    private intlService: IntlService
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
    const baseDataView: BaseDataView = this.getDataViewToSave();
    this.store.dispatch(new fromDataViewActions.SaveUserReport(baseDataView));
    this.showErrorMessages = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  private getDataViewToSave(): BaseDataView {
    const baseDataView: BaseDataView = this.createBaseDataView();
    if (this.activeEntity && this.activeEntity.RequiredInfo) {
      baseDataView.RequiredInfo = [];
      for (const info of this.activeEntity.RequiredInfo) {
        baseDataView.RequiredInfo.push({
          Value:  this.getFormValue(info),
          FieldName: info.FieldName,
          DisplayName: info.DisplayName,
          Type: info.Type
        });
      }
    }
    return baseDataView;
  }

  private resetForm(): void {
    this.baseDataViewForm.patchValue({
      entity: this.defaultEntity,
      name: '',
      summary: ''
    });
    this.onEntityChanged(this.defaultEntity);
  }

  onEntityChanged(entity: Entity) {
    this.removeOldControls(this.activeEntity);
    this.activeEntity = entity;
    this.setUpdatedControls(entity);
  }

  private setUpdatedControls(entity: Entity) {
    if (entity && entity.RequiredInfo) {
      for (const field of entity.RequiredInfo) {
        this.baseDataViewForm.addControl(
          field.FieldName,
          new FormControl('', Validators.required));
      }
    }
  }

  private removeOldControls(entity: Entity) {
    if (entity && entity.RequiredInfo) {
      for (const field of entity.RequiredInfo) {
        this.baseDataViewForm.removeControl(field.FieldName);
      }
    }
  }

  private getFormValue(info: EntityData) {
    let value = this.baseDataViewForm.get(info.FieldName).value;
    if (info.Type === FieldDataType.Date) {
      value = this.intlService.formatDate(value, 'yyyy-MM-dd');
    }
    return value;
  }
}
