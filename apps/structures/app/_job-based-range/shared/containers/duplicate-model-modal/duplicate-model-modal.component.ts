import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromDuplicateModelModalActions from '../../../shared/actions/duplicate-model-modal.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pf-duplicate-model-modal',
  templateUrl: './duplicate-model-modal.component.html',
  styleUrls: ['./duplicate-model-modal.component.scss']
})
export class DuplicateModelModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  modalOpen$: Observable<boolean>;
  modalOpenSubscription: Subscription;
  duplicatingModelAsyncObj$: Observable<AsyncStateObj<null>>;
  modelSettingsForm: FormGroup;
  attemptedSubmit: boolean;
  modelNameExistsFailure: boolean;
  modelNameExistsFailure$: Observable<boolean>;
  modelNameExistsFailureSubscription: Subscription;

  constructor(public store: Store<fromSharedJobBasedRangeReducer.State>) {
    this.modalOpen$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getDuplicateModelModalOpen));
    this.duplicatingModelAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getDuplicatingModelAsyncObj));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getDuplicateModelNameExistsFailure));
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    });
  }

  get formControls() {
    return this.modelSettingsForm.controls;
  }

  private reset() {
    this.attemptedSubmit = false;
  }

  // Events
  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;
  }

  handleModalSubmit() {
    if (this.modelSettingsForm.valid) {
      this.store.dispatch(new fromDuplicateModelModalActions.DuplicateModel(
        {
          rangeGroupId: this.rangeGroupId,
          modelName: this.modelSettingsForm.get('ModelName').value
        }
      ));
      this.reset();
    }
  }

  handleModalDismiss() {
    this.store.dispatch(new fromDuplicateModelModalActions.CloseModal());
    this.clearModelNameExistsFailure();
    this.reset();
  }

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromDuplicateModelModalActions.ClearModelNameExistsFailure());
    }
  }

  // Lifecycle
  ngOnInit(): void {
    this.buildForm();
    this.modalOpenSubscription = this.modalOpen$.subscribe(mo => {
      if (mo) {
        this.buildForm();
      }
    });
    this.modelNameExistsFailureSubscription = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
  }

  ngOnDestroy(): void {
    this.modalOpenSubscription.unsubscribe();
    this.modelNameExistsFailureSubscription.unsubscribe();
  }
}
