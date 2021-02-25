import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { AsyncStateObj } from 'libs/models/state';

import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';
import * as fromSharedStructuresReducer from '../../reducers';

@Component({
  selector: 'pf-model-settings-modal',
  templateUrl: './model-settings-modal.component.html',
  styleUrls: ['./model-settings-modal.component.scss']
})
export class ModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() modalOpen$: Observable<boolean>;
  @Input() modelSettingsForm: FormGroup;
  @Output() modalSubmit = new EventEmitter();
  @Output() modalAttemptedSubmit = new EventEmitter();
  @Output() modalDismissed = new EventEmitter();

  metaData$: Observable<RangeGroupMetadata>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;
  modelNameExistsFailure$: Observable<boolean>;

  metadataSub: Subscription;
  modelNameExistsFailureSub: Subscription;

  metadata: RangeGroupMetadata;
  modelNameExistsFailure: boolean;

  constructor(
    public store: Store<any>,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getSavingModelSettingsAsyncObj));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedStructuresReducer.getModelNameExistsFailure));
  }

  get modalTitle() {
    return this.metadata.StructureName;
  }

  get modalSubTitle() {
    return this.metadata.Paymarket;
  }

  get buttonPrimaryText() {
    return this.metadata.IsCurrent ? 'Create Model' : 'Save';
  }

  get buttonPrimaryTextSubmitting() {
    return this.metadata.IsCurrent ? 'Creating Model...' : 'Saving...';
  }

  handleModalSubmit() {
    this.modalSubmit.emit();
  }

  handleModalSubmitAttempt() {
    this.modalAttemptedSubmit.emit();
  }

  handleModalDismiss() {
    this.store.dispatch(new fromModelSettingsModalActions.Cancel());
    this.store.dispatch(new fromModelSettingsModalActions.CloseModal());
    this.clearModelNameExistsFailure();
    this.modalDismissed.emit();
  }

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
    }
  }

  // LifeCycle
  ngOnInit(): void {
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
  }

  private unsubscribe() {
    this.metadataSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
  }

}
