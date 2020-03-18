import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';

import { CompanyJobUdf } from 'libs/models';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PfValidators } from 'libs/forms';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'pf-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JobFormComponent implements OnInit, OnDestroy {

  showJobModal$: Observable<boolean>;
  duplicateJobCodeError$: Observable<boolean>;
  jobFamilies$: Observable<string[]>;
  jobFlsaStatuses$: Observable<string[]>;
  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;

  udfsSubscription: Subscription;
  formChangesSubscription: Subscription;
  onShowFormSubscription: Subscription;
  duplicateJobCodeErrorSubscription: Subscription;
  loadJobSuccessSubscription: Subscription;

  jobForm: FormGroup;
  duplicateJobCodeError = false;

  readonly JOB_CODE_FLSA_MAX_LENGTH = 50;
  readonly DEFAULT_MAX_LENGTH = 255;

  // convenience getter for easy access to form fields
  get f() { return this.jobForm.controls; }

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  constructor(
    private store: Store<fromJobManagementReducer.State>,
    private formBuilder: FormBuilder,
    private actionsSubject: ActionsSubject
  ) {
    this.showJobModal$ = this.store.select(fromJobManagementReducer.getShowJobModal);
    this.duplicateJobCodeError$ = this.store.select(fromJobManagementReducer.getDuplicateJobCodeError);
    this.jobFamilies$ = this.store.select(fromJobManagementReducer.getJobFamilies);
    this.jobFlsaStatuses$ = this.store.select(fromJobManagementReducer.getCompanyFlsaStatuses);
    this.jobUserDefinedFields$ = this.store.select(fromJobManagementReducer.getCompanyJobUdfs);

    this.jobForm = formBuilder.group({
      JobCode: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(this.JOB_CODE_FLSA_MAX_LENGTH),
        this.validateDuplicateJobCode.bind(this)]],
      JobFamily: ['', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)],
      JobTitle: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      JobLevel: ['', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)],
      FLSAStatus: ['', PfValidators.maxLengthTrimWhitespace(this.JOB_CODE_FLSA_MAX_LENGTH)],
      JobStatus: true,
    });

     this.loadJobSuccessSubscription = actionsSubject
      .pipe(ofType(fromJobManagementActions.LOAD_JOB_SUCCESS))
      .subscribe((action: fromJobManagementActions.LoadJobSuccess) => {
        this.jobForm.patchValue(action.payload.JobInfo);
      });
  }

  ngOnInit() {
    const me = this;

    this.udfsSubscription = this.jobUserDefinedFields$.subscribe(userDefinedFields => {
      for (const userDefinedField of userDefinedFields) {
        this.jobForm.addControl(
          userDefinedField.ColumnName,
          new FormControl('', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)));
      }
    });

    this.formChangesSubscription = this.jobForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromJobManagementActions.UpdateCompanyJob(value));
    });

    this.onShowFormSubscription = this.showJobModal$.subscribe(value => {
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
    this.loadJobSuccessSubscription.unsubscribe();
  }

  validateDuplicateJobCode(control: AbstractControl) {
    return this.duplicateJobCodeError ? { duplicateJobCode: true } : null;
  }
}
