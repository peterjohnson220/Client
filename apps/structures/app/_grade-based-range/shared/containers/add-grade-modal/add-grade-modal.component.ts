import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromGradeBasedSharedReducer from '../../reducers';
import * as fromAddGradeModalActions from '../../actions/add-grade-modal.actions';

@Component({
  selector: 'pf-add-grade-modal',
  templateUrl: './add-grade-modal.component.html'
})
export class AddGradeModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  modalOpen$: Observable<boolean>;
  modalOpenSubscription: Subscription;
  addingGradeAsyncObj$: Observable<AsyncStateObj<null>>;
  newGradeForm: FormGroup;
  attemptedSubmit: boolean;
  gradeNameExistsFailure: boolean;
  gradeNameExistsFailure$: Observable<boolean>;
  gradeNameExistsFailureSubscription: Subscription;

  constructor(public store: Store<fromGradeBasedSharedReducer.State>) {
    this.modalOpen$ = this.store.pipe(select(fromGradeBasedSharedReducer.getAddGradeModalOpen));
    this.addingGradeAsyncObj$ = this.store.pipe(select(fromGradeBasedSharedReducer.getAddingGradeAsyncObj));
    this.gradeNameExistsFailure$ = this.store.pipe(select(fromGradeBasedSharedReducer.getGradeNameExistsFailure));
  }

  buildForm() {
    this.newGradeForm = new FormGroup({
      'GradeName': new FormControl('', [Validators.required, Validators.maxLength(255)]),
    });
  }

  get formControls() {
    return this.newGradeForm.controls;
  }

  private reset() {
    this.attemptedSubmit = false;
  }

  // Events
  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;
  }

  handleModalSubmit() {
    if (this.newGradeForm.valid) {
      this.store.dispatch(new fromAddGradeModalActions.AddGrade(
        {
          rangeGroupId: this.rangeGroupId,
          gradeName: this.newGradeForm.get('GradeName').value
        }
      ));
      this.reset();
    }
  }

  handleModalDismiss() {
    this.store.dispatch(new fromAddGradeModalActions.CloseModal());
    this.clearGradeNameExistsFailure();
    this.reset();
  }

  clearGradeNameExistsFailure() {
    if (this.gradeNameExistsFailure) {
      this.store.dispatch(new fromAddGradeModalActions.ClearGradeNameExistsFailure());
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
    this.gradeNameExistsFailureSubscription = this.gradeNameExistsFailure$.subscribe(gef => this.gradeNameExistsFailure = gef);
  }

  ngOnDestroy(): void {
    this.modalOpenSubscription.unsubscribe();
    this.gradeNameExistsFailureSubscription.unsubscribe();
  }
}
