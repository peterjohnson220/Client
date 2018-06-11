import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/index';
import { timer as observableTimer,  Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { PfValidators } from 'libs/forms/validators/index';
import { Exchange } from 'libs/models/peer/index';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/index';

import * as fromJobFamiliesActions from '../../../actions/job-family.actions';
import * as fromPeerManagementReducer from '../../../reducers/index';
import * as fromSharedPeerReducer from '../../../../shared/reducers/index';

@Component({
  selector: 'pf-new-job-form',
  templateUrl: './new-job-form.component.html',
  styleUrls: ['./new-job-form.component.scss']
})

export class NewJobFormComponent implements OnInit, OnDestroy {
  @ViewChild('jobFamiliesComboBox') jobFamiliesComboBox: ComboBoxComponent;
  @Input() exchange: Exchange;
  @Input() exchangeJobRequestForm: FormGroup;

  newJobRequesting$: Observable<boolean>;
  potentialJobFamiles$: Observable<string[]>;
  potentialJobFamilesLoading$: Observable<boolean>;
  potentialJobFamiliesSubscription: Subscription;
  potentialJobFamilies: string[];
  potentialJobFamiliesFiltered: string[];
  reason = '';
  jobTitle = '';
  jobFamily = '';
  jobLevel = '';
  jobDescription = '';

  constructor(
    private store: Store<fromPeerManagementReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {
    this.potentialJobFamiles$ = this.store.select(fromPeerManagementReducer.getJobFamilies);
    this.potentialJobFamilesLoading$ = this.store.select(fromPeerManagementReducer.getJobFamiliesLoading);
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like to add this new job to the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get newJobForm(): FormGroup { return this.exchangeJobRequestForm.get('newJobForm') as FormGroup; }
  get jobTitleControl() { return this.newJobForm.get('jobTitle'); }

  applyNewJobForm(): void {
    this.exchangeJobRequestForm.addControl('newJobForm', this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'jobTitle': [this.jobTitle, [PfValidators.required, Validators.minLength(3)], [this.jobTitleValidator()]],
      'jobFamily': [this.jobFamily],
      'jobLevel': [this.jobLevel],
      'jobDescription': [this.jobDescription]
    }));
  }

  handleJobFamilyFilterChange(value) {
    this.potentialJobFamiliesFiltered = this.potentialJobFamilies.filter(jf =>
      jf.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    if (this.potentialJobFamiliesFiltered.length < 1) {
      this.jobFamiliesComboBox.toggle(false);
    }
  }

  handleJobFamilyValueChange(value) {
    this.newJobForm.get('jobFamily').setValue(value);
  }

  ngOnInit(): void {
    this.applyNewJobForm();
    this.store.dispatch(new fromJobFamiliesActions.LoadJobFamilies);

    this.potentialJobFamiliesSubscription = this.potentialJobFamiles$.subscribe(jf => {
      this.potentialJobFamilies = jf;
      this.potentialJobFamiliesFiltered = this.potentialJobFamilies.slice(0);
    });
  }

  jobTitleValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const jobTitle = control.value;
      const exchangeId = this.exchange ? this.exchange.ExchangeId : 0;
      return observableTimer(500).pipe(switchMap(() => {
        return this.exchangeCompanyApiService
          .validateNewJobTitle(exchangeId, jobTitle).pipe(
          map(result => {
            return result ? { jobTitleExists: result } : null;
          }));
      }));
    };
  }

  ngOnDestroy(): void {
    this.potentialJobFamiliesSubscription.unsubscribe();
  }
}
