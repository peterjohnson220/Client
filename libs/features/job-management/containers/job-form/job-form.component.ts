import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompanyJobUdf } from 'libs/models';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'pf-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JobFormComponent implements OnInit, OnDestroy {

  showJobForm$: Observable<boolean>;
  loading$: Observable<boolean>;
  saving$: Observable<boolean>;
  errorMessage$: Observable<string>;
  duplicateJobCodeError$: Observable<boolean>;
  jobFamilies$: Observable<string[]>;
  jobFlsaStatuses$: Observable<string[]>;
  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;

  udfsSubscription: Subscription;
  formChangesSubscription: Subscription;
  onShowFormSubscription: Subscription;
  duplicateJobCodeErrorSubscription: Subscription;

  jobForm: FormGroup;
  duplicateJobCodeError = false;

  readonly JOB_CODE_MAX_LENGTH = 50;
  readonly DEFAULT_MAX_LENGTH = 255;

  // convenience getter for easy access to form fields
  get f() { return this.jobForm.controls; }

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  constructor(
    private store: Store<fromJobManagementReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.showJobForm$ = this.store.select(fromJobManagementReducer.getShowJobForm);
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.saving$ = this.store.select(fromJobManagementReducer.getSaving);
    this.errorMessage$ = this.store.select(fromJobManagementReducer.getErrorMessage);
    this.duplicateJobCodeError$ = this.store.select(fromJobManagementReducer.getDuplicateJobCodeError);
    this.jobFamilies$ = this.store.select(fromJobManagementReducer.getJobFamilies);
    this.jobFlsaStatuses$ = this.store.select(fromJobManagementReducer.getCompanyFlsaStatuses);
    this.jobUserDefinedFields$ = this.store.select(fromJobManagementReducer.getCompanyJobUdfs);

    this.jobForm = formBuilder.group({
      JobCode: ['', [Validators.required, Validators.maxLength(this.JOB_CODE_MAX_LENGTH), this.validateDuplicateJobCode.bind(this)]],
      JobFamily: '',
      JobTitle: ['', [Validators.required, Validators.maxLength(this.DEFAULT_MAX_LENGTH)]],
      JobLevel: ['', Validators.maxLength(this.DEFAULT_MAX_LENGTH)],
      FLSAStatus: '',
      JobStatus: true,
    });
  }

  ngOnInit() {
    const me = this;

    this.udfsSubscription = this.jobUserDefinedFields$.subscribe(userDefinedFields => {
      for (const userDefinedField of userDefinedFields) {
        this.jobForm.addControl(userDefinedField.ColumnName, new FormControl('', Validators.maxLength(this.DEFAULT_MAX_LENGTH)));
      }
    });

    this.formChangesSubscription = this.jobForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromJobManagementActions.UpdateCompanyJob(value));
    });

    this.onShowFormSubscription = this.showJobForm$.subscribe(value => {
      this.jobForm.reset();
      this.store.dispatch(new fromJobManagementActions.SetDuplicateJobCodeError(false));
    });

    this.duplicateJobCodeErrorSubscription = this.duplicateJobCodeError$.subscribe(value => {
      this.duplicateJobCodeError = value;
      if (value) {
        me.f.JobCode.updateValueAndValidity();
      }
    });

    this.f.JobCode.valueChanges.subscribe(val => {
      if (this.duplicateJobCodeError) {
        this.store.dispatch(new fromJobManagementActions.SetDuplicateJobCodeError(false));
      }
    });
  }

  ngOnDestroy() {
    this.udfsSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
    this.onShowFormSubscription.unsubscribe();
    this.duplicateJobCodeErrorSubscription.unsubscribe();
  }

  submit(): void {
    this.jobForm.markAllAsTouched();

    if (this.jobForm.valid) {
      this.store.dispatch(new fromJobManagementActions.SaveCompanyJob());
    }
  }

  validateDuplicateJobCode(control: AbstractControl) {
    return this.duplicateJobCodeError ? { duplicateJobCode: true } : null;
  }
}
