import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { PfValidators } from 'libs/forms';

import * as fromCompanyControlInsertReducer from '../../reducers';
import * as fromCompanyControlInsertAction from '../../actions';

@Component({
  selector: 'pf-create-company-control-modal',
  templateUrl: './create-company-control-modal.component.html',
  styleUrls: ['./create-company-control-modal.component.scss']
})
export class CreateCompanyControlModalComponent implements OnInit, OnDestroy {

  public createNewControlForm: FormGroup;
  private errorValidationMessage: string;

  // Observables
  createControlModalOpen$: Observable<boolean>;
  creatingControl$: Observable<boolean>;
  creatingControlError$: Observable<boolean>;
  creatingControlErrorMessage$: Observable<string>;

  // Subscriptions
  errorSubscription: Subscription;
  errorMessageSubscription: Subscription;

  get name() { return (this.createNewControlForm.get('name') ); }

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromCompanyControlInsertReducer.State>
  ) {
    this.createControlModalOpen$ = this.store.pipe(select(fromCompanyControlInsertReducer.getCreateContrlModalOpen));
    this.creatingControl$ = this.store.pipe(select(fromCompanyControlInsertReducer.getCreatingControl));
    this.creatingControlError$ = this.store.pipe(select(fromCompanyControlInsertReducer.getCreatingControlError));
    this.creatingControlErrorMessage$ = this.store.pipe(select(fromCompanyControlInsertReducer.getCreatingControlErrorMessage));
    this.buildForm();
  }

  ngOnInit() {
    this.errorMessageSubscription = this.creatingControlErrorMessage$.subscribe(em => this.errorValidationMessage = em);
    this.errorSubscription = this.creatingControlError$.subscribe(error => {
      if (error) {
        this.name.setErrors({'error': this.errorValidationMessage});
      }
    });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  handleFormSubmit() {
    this.store.dispatch(new fromCompanyControlInsertAction.CreateControl({controlName: this.name.value}));
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCompanyControlInsertAction.CloseCreateControlModal());
  }

  buildForm() {
    this.createNewControlForm = this.formBuilder.group({
      'name': ['', [PfValidators.required, PfValidators.minLengthTrimWhitespace(1), Validators.maxLength(100)]],
    });
  }
}
