import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';
import { AsyncStateObj } from 'libs/models/state';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';
import { AbstractModelSettingsContentComponent } from './abstract-model-settings-content';

@Component({
  template: ''
})
export abstract class AbstractModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() isNewModel = true;

  metaData$: Observable<RangeGroupMetadata>;
  loadingMetaData$: Observable<boolean>;
  modalOpen$: Observable<boolean>;
  modelNameExistsFailure$: Observable<boolean>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<any>>;

  modelNameExistsFailureSub: Subscription;
  metaDataSubscription: Subscription;
  modalOpenSubscription: Subscription;

  @ViewChild(AbstractModelSettingsContentComponent, { static: false }) protected modelContentComponent: AbstractModelSettingsContentComponent;

  metaData: RangeGroupMetadata;
  modelSettingsForm: FormGroup;
  modelNameExistsFailure: boolean;

  constructor(
    protected sharedStore: Store<fromSharedStructuresReducer.State>
  ) {
    this.metaData$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.loadingMetaData$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getLoadingMetaData));
    this.modelNameExistsFailure$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getModelNameExistsFailure));
    this.savingModelSettingsAsyncObj$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getSavingModelSettingsAsyncObj));
  }

  ngOnInit(): void {
    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
    this.metaDataSubscription = this.metaData$.subscribe(metaData => {
      this.metaData = metaData;
      this.updateForm();
    });
  }

  ngOnDestroy(): void {
    this.modelNameExistsFailureSub.unsubscribe();
    this.metaDataSubscription.unsubscribe();
    this.modalOpenSubscription.unsubscribe();
  }

  handleModalSubmit() {
    this.modelContentComponent.handleModalSubmit();
  }

  handleModalSubmitAttempt() {
    this.modelContentComponent.handleModalSubmitAttempt();
  }

  handleModalDismiss() {
    this.sharedStore.dispatch(new fromModelSettingsModalActions.Cancel());
    this.sharedStore.dispatch(new fromModelSettingsModalActions.CloseModal());
    this.clearModelNameExistsFailure();
    this.resetForm();
    this.modelContentComponent.reset();
  }

  protected setValidators(controlName: string, min: number, max: number) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  protected clearValidators(controlName: string) {
    this.modelSettingsForm.get(controlName).disable();
    this.modelSettingsForm.get(controlName).clearValidators();
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  protected buildForm() {}
  protected updateForm() {}
  protected resetForm() {}

  private clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.sharedStore.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
    }
  }
}
