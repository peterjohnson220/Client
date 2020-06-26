import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { Store, ActionsSubject } from '@ngrx/store';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';

import { PfValidators, JobDescriptionSummaryEditorComponent } from 'libs/forms';
import { JobDescriptionSummary } from 'libs/models';

@Component({
  selector: 'pf-standard-fields',
  templateUrl: './standard-fields.component.html',
  styleUrls: ['./standard-fields.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StandardFieldsComponent implements OnInit, OnDestroy {

  @ViewChild('jobDescriptionEditor', { static: true }) jobDescriptionEditor: JobDescriptionSummaryEditorComponent;

  duplicateJobCodeError$: Observable<boolean>;
  jobFamilies$: Observable<string[]>;
  jobFlsaStatuses$: Observable<string[]>;
  jobDescriptionSummary$: Observable<JobDescriptionSummary>;
  isJdmEnabled$: Observable<boolean>;

  formChangesSubscription: Subscription;
  duplicateJobCodeErrorSubscription: Subscription;
  loadJobSuccessSubscription: Subscription;
  resetStateSubscription: Subscription;

  jobForm: FormGroup;
  duplicateJobCodeError = false;

  jobDescriptionSummary: JobDescriptionSummary;

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
    private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.duplicateJobCodeError$ = this.store.select(fromJobManagementReducer.getDuplicateJobCodeError);
    this.jobFamilies$ = this.store.select(fromJobManagementReducer.getJobFamilies);
    this.jobFlsaStatuses$ = this.store.select(fromJobManagementReducer.getCompanyFlsaStatuses);
    this.jobDescriptionSummary$ = this.store.select(fromJobManagementReducer.getJobDescriptionSummary);
    this.isJdmEnabled$ = this.store.select(fromJobManagementReducer.getIsJdmEnabled);

    this.jobForm = this.formBuilder.group({
      JobCode: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(this.JOB_CODE_FLSA_MAX_LENGTH),
        this.validateDuplicateJobCode.bind(this)]],
      JobFamily: ['', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)],
      JobTitle: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      JobLevel: ['', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)],
      FLSAStatus: ['', PfValidators.maxLengthTrimWhitespace(this.JOB_CODE_FLSA_MAX_LENGTH)],
      JobStatus: true
    });

    this.loadJobSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.LOAD_JOB_SUCCESS))
      .subscribe((action: fromJobManagementActions.LoadJobSuccess) => {
        this.jobForm.patchValue(action.payload.JobInfo);
        this.jobDescriptionSummary = action.payload.JobSummaryObj;
      });

    this.resetStateSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.RESET_STATE))
      .subscribe(data => {
        this.jobForm.reset();
        this.jobDescriptionEditor.reset();
        this.jobDescriptionSummary = null;
        this.store.dispatch(new fromJobManagementActions.SetDuplicateJobCodeError(false));
      });

    this.formChangesSubscription = this.jobForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromJobManagementActions.UpdateStandardFields(value));
    });

    this.duplicateJobCodeErrorSubscription = this.duplicateJobCodeError$.subscribe(value => {
      this.duplicateJobCodeError = value;
      if (value) {
        this.f.JobCode.updateValueAndValidity();
      }
    });

    this.f.JobCode.valueChanges.subscribe(val => {
      if (this.duplicateJobCodeError) {
        this.store.dispatch(new fromJobManagementActions.SetDuplicateJobCodeError(false));
      }
    });
  }

  ngOnDestroy() {
    this.formChangesSubscription.unsubscribe();
    this.duplicateJobCodeErrorSubscription.unsubscribe();
    this.loadJobSuccessSubscription.unsubscribe();
    this.resetStateSubscription.unsubscribe();
  }

  jobDescriptionChanged(newJobDescription: string) {
    this.store.dispatch(new fromJobManagementActions.UpdateJobDescription(newJobDescription));
  }

  validateDuplicateJobCode(control: AbstractControl) {
    return this.duplicateJobCodeError ? { duplicateJobCode: true } : null;
  }

  isValid(): boolean {
    return this.jobForm.valid && this.jobDescriptionEditor.isValid();
  }
}
