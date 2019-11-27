import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompanyBaseInformation } from 'libs/models/company';
import { PayElement, UdfSetting } from 'libs/models/payfactors-api/survey/response/udf-data-response.model';
import { UdfSettingsRequestModel } from 'libs/models/payfactors-api/survey/request/udf-settings-request.model';
import { environment } from 'environments/environment';

import * as fromUdfManagerActions from '../actions/udf-manager.actions';
import * as fromUdfManagerReducer from '../reducers';

const take = 100;

@Component({
  selector: 'pf-udf-manager',
  templateUrl: './udf-manager.page.html',
  styleUrls: ['./udf-manager.page.scss']
})
export class UdfManagerPageComponent implements OnDestroy, OnInit {
  env = environment;
  selectedCompany: CompanyBaseInformation;
  udfValues: UdfSettingsRequestModel[];

  companiesList$: Observable<CompanyBaseInformation[]>;
  companiesListLoading$: Observable<boolean>;
  companiesListLoadingError$: Observable<boolean>;
  selectedCompany$: Observable<CompanyBaseInformation>;
  confirmSave$: Observable<boolean>;
  savedUdfSettings$: Observable<UdfSetting[]>;
  savedUdfSettingsLoading$: Observable<boolean>;
  savedUdfSettingsLoadingError$: Observable<boolean>;
  payElements$: Observable<PayElement[]>;
  savingUdfsError$: Observable<boolean>;
  savingUdfsErrorMessage$: Observable<string>;

  selectedCompanySubscription: Subscription;

  constructor(private store: Store<fromUdfManagerReducer.State>) { }

  ngOnInit(): void {
    // Observables
    this.companiesList$ = this.store.select(fromUdfManagerReducer.getCompaniesList);
    this.companiesListLoading$ = this.store.select(fromUdfManagerReducer.getCompaniesListLoading);
    this.companiesListLoadingError$ = this.store.select(fromUdfManagerReducer.getCompaniesListLoadingError);
    this.selectedCompany$ = this.store.select(fromUdfManagerReducer.getSelectedCompany);
    this.confirmSave$ = this.store.select(fromUdfManagerReducer.getConfirmSave);
    this.savedUdfSettings$ = this.store.select(fromUdfManagerReducer.getUdfSettings);
    this.savedUdfSettingsLoading$ = this.store.select(fromUdfManagerReducer.getUdfSettingsLoading);
    this.savedUdfSettingsLoadingError$ = this.store.select(fromUdfManagerReducer.getUdfSettingsLoadingError);
    this.payElements$ = this.store.select(fromUdfManagerReducer.getPayElements);
    this.savingUdfsError$ = this.store.select(fromUdfManagerReducer.getSavingUdfsError);
    this.savingUdfsErrorMessage$ = this.store.select(fromUdfManagerReducer.getSavingUdfsErrorMessage);

    // Subscriptions
    this.selectedCompanySubscription = this.store.select(fromUdfManagerReducer.getSelectedCompany).subscribe(
      company => this.selectedCompany = company
    );
  }

  ngOnDestroy(): void {
    this.selectedCompanySubscription.unsubscribe();
  }

  onSelectedCompany(company: CompanyBaseInformation) {
    this.store.dispatch(new fromUdfManagerActions.SetSelectedCompany(company));
    this.store.dispatch(new fromUdfManagerActions.GetSurveyUdfs(company.CompanyId));
  }

  onUnselectCompany() {
    this.store.dispatch(new fromUdfManagerActions.UnselectCompany());
  }

  onFilterCompanies(filterRequest: { searchTerm: string, take: number }) {
    this.store.dispatch(new fromUdfManagerActions.LoadUdfCompanies(filterRequest));
  }

  onSaveUdfs(model: UdfSettingsRequestModel[]) {
    this.udfValues = model;
    this.store.dispatch(new fromUdfManagerActions.ConfirmSave());
  }

  onSaveUdfsSubmit() {
    this.store.dispatch(new fromUdfManagerActions.SaveSurveyUdfs(this.selectedCompany.CompanyId, this.udfValues));
  }

  onSaveUdfsDismiss() {
    this.store.dispatch(new fromUdfManagerActions.DismissSave());
  }
}
