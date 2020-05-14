import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { GenericKeyValue } from 'libs/models/common';
import { ExchangeJobAssociationEntityTypes } from 'libs/constants/peer/exchange-job-association-entity-types';
import * as fromAssociateJobsActions from 'libs/features/peer/job-association-match/actions/associate-jobs.actions';
import * as fromAssociateJobMatchReducer from 'libs/features/peer/job-association-match/reducers';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromCompanyOptionsActions from '../../../actions/exchange-job-association-utility/company-options.actions';
import * as fromExchangeOptionsActions from '../../../actions/exchange-job-association-utility/exchange-options.actions';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-exchange-job-association-import',
  templateUrl: './exchange-job-association-utility.page.html',
  styleUrls: ['./exchange-job-association-utility.page.scss']
})
export class ExchangeJobAssociationUtilityPageComponent implements OnInit, OnDestroy {

  env = environment;

  @ViewChild('companyList', { static: true }) companyList: ComboBoxComponent;
  @ViewChild('exchangeList', { static: true }) exchangeList: ComboBoxComponent;

  companyOptions$: Observable<GenericKeyValue<number, string>[]>;
  exchangeOptions$: Observable<GenericKeyValue<number, string>[]>;
  companyOptionsLoading$: Observable<boolean>;
  exchangeOptionsLoading$: Observable<boolean>;
  autoAssociatingError$: Observable<boolean>;
  autoAssociating$: Observable<boolean>;
  exportingMatches$: Observable<boolean>;
  exportingMatchesError$: Observable<boolean>;
  autoAssociatingCount$: Observable<number>;

  exchangeOptionsSubscription: Subscription;
  companyOptionsSubscription: Subscription;

  companyOptions: GenericKeyValue<number, string>[];
  companyOptionsFiltered: GenericKeyValue<number, string>[];
  companySelection: GenericKeyValue<number, string>;
  exchangeOptions: GenericKeyValue<number, string>[];
  exchangeOptionsFiltered: GenericKeyValue<number, string>[];
  exchangeSelection: GenericKeyValue<number, string>;
  autoAssociationForm: FormGroup;
  exportAssociationForm: FormGroup;
  hasAttemptedRun: boolean;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private fb: FormBuilder,
    private associateJobMatchStore: Store<fromAssociateJobMatchReducer.State>
  ) {
    this.companyOptions$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyOptions));
    this.companyOptionsLoading$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyOptionsLoading));
    this.exchangeOptions$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeOptions));
    this.exchangeOptionsLoading$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeOptionsLoading));
    this.autoAssociating$ = this.store.pipe(select(fromPeerAdminReducer.getAssociatingJobs));
    this.autoAssociatingError$ = this.store.pipe(select(fromPeerAdminReducer.getAssociatingJobsError));
    this.autoAssociatingCount$ = this.store.pipe(select(fromPeerAdminReducer.getAssociatingJobsCount));
    this.exportingMatches$ = this.associateJobMatchStore.select(fromAssociateJobMatchReducer.getExportingMatches);
    this.exportingMatchesError$ = this.associateJobMatchStore.select(fromAssociateJobMatchReducer.getExportingMatchesError);
  }

  get companySelectionControl(): FormControl {
    return this.autoAssociationForm.get('companySelection') as FormControl;
  }

  get exchangeSelectionControl(): FormControl {
    return this.autoAssociationForm.get('exchangeSelection') as FormControl;
  }

  get exportCompanySelectionControl(): FormControl {
    return this.exportAssociationForm.get('exportCompanySelection') as FormControl;
  }

  // Events
  handleRunButtonClick(): void {
    const payload = {
      CompanyId: this.companySelectionControl.value,
      ExchangeId: this.exchangeSelectionControl.value
    };
    this.store.dispatch(new fromAssociateJobsActions.AssociateJobs(payload));
    this.hasAttemptedRun = true;
  }

  handleExportButtonClick(): void {
    this.store.dispatch(new fromAssociateJobsActions.DownloadAssociations({entityId: this.exportCompanySelectionControl.value, entityType: ExchangeJobAssociationEntityTypes.COMPANY}));
  }

  handleCompanyFilterChange(value: string) {
    this.companyOptionsFiltered = this.companyOptions.filter(co =>
      co.Value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    ).slice(0, 10);

    if (this.companyOptionsFiltered.length < 1) {
      this.companyList.toggle(false);
    }
  }

  handleExchangeFilterChange(value: string) {
    this.exchangeOptionsFiltered = this.exchangeOptions.filter(co =>
      co.Value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    if (this.exchangeOptionsFiltered.length < 1) {
      this.exchangeList.toggle(false);
    }
  }

  handleCompanySelectionChange(value: GenericKeyValue<number, string>) {
    this.exchangeSelectionControl.reset();

    const companySelected = !!value;
    if (companySelected) {
      this.store.dispatch(new fromExchangeOptionsActions.LoadExchangeOptions(value.Key));
    }
  }

  // Life-cycle Events
  ngOnInit(): void {
    this.store.dispatch(new fromCompanyOptionsActions.LoadCompanyOptions);
    this.hasAttemptedRun = false;
    this.autoAssociationForm = this.fb.group(
      {
        companySelection: ['', Validators.required],
        exchangeSelection: ['', Validators.required]
      }
    );
    this.exportAssociationForm = this.fb.group(
      {
        exportCompanySelection: ['', Validators.required]
      }
    );
    this.companyOptionsSubscription = this.companyOptions$.subscribe(co => {
      this.companyOptions = co;
      this.companyOptionsFiltered = this.companyOptions.slice(0, 10);
    });

    this.exchangeOptionsSubscription = this.exchangeOptions$.subscribe(eo => {
      this.exchangeOptions = eo;
      this.exchangeOptionsFiltered = this.exchangeOptions.slice(0);
    });
  }

  ngOnDestroy(): void {
    this.companyOptionsSubscription.unsubscribe();
    this.exchangeOptionsSubscription.unsubscribe();
  }
}
