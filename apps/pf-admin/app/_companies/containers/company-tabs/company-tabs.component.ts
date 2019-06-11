import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompanyTilesResponse, CompanyDataSetsReponse, ListCompositeFields } from 'libs/models/payfactors-api';
import { CompanySetting } from 'libs/models/company';

import * as fromPfAdminMainReducer from '../../reducers';
import * as fromCompanyPageActions from '../../actions/company-page.actions';
import { SecondarySurveyFieldsModalComponent } from '../../components';
import { CustomCompanySettings } from '../../models';

@Component({
  selector: 'pf-company-tabs',
  templateUrl: './company-tabs.component.html',
  styleUrls: ['./company-tabs.component.scss']
})
export class CompanyTabsComponent implements OnInit {
  @Input() customCompanySettings: CustomCompanySettings;

  @ViewChild(SecondarySurveyFieldsModalComponent, { static: true })
  secondarySurveyFieldsModalComponent: SecondarySurveyFieldsModalComponent;

  loadingCompanyTiles$: Observable<boolean>;
  loadingCompanyTilesError$: Observable<boolean>;
  companyTiles$: Observable<CompanyTilesResponse[]>;

  loadingCompanySettings$: Observable<boolean>;
  loadingCompanySettingsError$: Observable<boolean>;
  companySettings$: Observable<CompanySetting[]>;

  loadingCompanyDataSets$: Observable<boolean>;
  loadingCompanyDataSetsError$: Observable<boolean>;
  companyDataSets$: Observable<CompanyDataSetsReponse[]>;

  compositeFields$: Observable<ListCompositeFields[]>;

  constructor( private store: Store<fromPfAdminMainReducer.State> ) {}

  ngOnInit() {
    this.loadingCompanyTiles$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTiles);
    this.loadingCompanyTilesError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTilesError);
    this.companyTiles$ = this.store.select(fromPfAdminMainReducer.getCompanyTiles);

    this.loadingCompanySettings$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettings);
    this.loadingCompanySettingsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettingsError);
    this.companySettings$ = this.store.select(fromPfAdminMainReducer.getCompanySettings);

    this.loadingCompanyDataSets$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSets);
    this.loadingCompanyDataSetsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSetsError);
    this.companyDataSets$ = this.store.select(fromPfAdminMainReducer.getCompanyDataSets);

    this.compositeFields$ = this.store.select(fromPfAdminMainReducer.getCompositeFields);
  }

  handleSurveyFieldsClicked() {
    event.preventDefault();
    event.stopPropagation();
    this.secondarySurveyFieldsModalComponent.open();
  }

  toggleCompanyTile(companyTile: CompanyTilesResponse) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanyTile(companyTile));
  }

  toggleCompanyDataSet(companyDataSet: CompanyDataSetsReponse) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanyDataSet(companyDataSet));
  }

  toggleCompanySetting(companySetting: CompanySetting) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanySetting(companySetting));
  }
}
