import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

import * as fromSurveysReducer from '../../reducers';
import * as fromSurveysActions from '../../actions/survey-actions';

@Component({
  selector: 'pf-map-company-modal',
  templateUrl: './map-company-modal.component.html',
  styleUrls: ['./map-company-modal.component.scss']
})
export class MapCompanyModalComponent implements OnDestroy, OnInit {

  @Input() surveyId: number;
  companiesList: any = [];
  mappedCompanies: any = {};
  tbxSearch: string;
  selectedCompany: number;
  hasCompanySurveyUDFs: boolean;

  private unsubscribe$ = new Subject();
  mapCompaniesModalOpen$: Observable<any>;
  modalData$: Observable<any>;
  isLoadingMapModalData$: Observable<boolean>;
  getMapModalDataFailed$: Observable<boolean>;

  constructor(private surveyApi: SurveyLibraryApiService,
    private store: Store<fromSurveysReducer.State>) {
    this.mapCompaniesModalOpen$ = this.store.select(fromSurveysReducer.isMapCompaniesModalOpen);
    this.modalData$ = this.store.select(fromSurveysReducer.mapCompaniesModalData);
    this.isLoadingMapModalData$ = this.store.select(fromSurveysReducer.isLoadingMapModalData);
    this.getMapModalDataFailed$ = this.store.select(fromSurveysReducer.getMapModalDataFailed);
  }

  ngOnInit(): void {
    this.modalData$.subscribe(f => {
      this.mappedCompanies = cloneDeep(f.Mapped);
      this.companiesList = f.NotMapped;
      this.hasCompanySurveyUDFs = f.HasCompanySurveyUdfs;
    });
  }

  addAssociation(companyId: number) {
    this.surveyApi.insertCompanySurvey(this.surveyId, companyId).subscribe(f => {
      this.refreshData();
    });
  }

  shouldAdd(companyId: number) {
    if (this.selectedCompany === companyId) {
      this.addAssociation(companyId);
    }
  }

  removeAssociation(companyId: number) {
    const confirmed = confirm('Are you sure you want to remove this company?');
    if (confirmed) {
      this.surveyApi.removeCompanySurvey(this.surveyId, companyId).subscribe(f => {
        this.refreshData();
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  handleModalDismissed() {
    this.tbxSearch = '';
    this.store.dispatch(new fromSurveysActions.ShouldRefreshGrid(true));
    this.store.dispatch(new fromSurveysActions.SetMapCompaniesModalOpen(false));
  }

  handleSearchChanged() {
    this.refreshData();
  }

  refreshData() {
    this.store.dispatch(new fromSurveysActions.GetMapCompaniesModalData(this.surveyId, this.tbxSearch));
  }

  clearClick() {
    this.tbxSearch = '';
  }

  saveItem(item: any) {
    this.surveyApi.updateCompanySurvey(this.surveyId, item.CompanyId, item.AgingFactor, item.SurveyCost).subscribe();
  }
}
