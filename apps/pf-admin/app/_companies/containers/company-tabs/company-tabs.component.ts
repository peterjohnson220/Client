import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CompanyTilesResponse, CompanyDataSetsReponse, ListCompositeFields } from 'libs/models/payfactors-api';
import { CompanySetting } from 'libs/models/company';
import { CompanyClientTypeConstants } from 'libs/constants';

import * as fromPfAdminMainReducer from '../../reducers';
import * as fromCompanyPageActions from '../../actions/company-page.actions';
import { SecondarySurveyFieldsModalComponent } from '../../components';
import { CustomCompanySettings, CompanyTabsContext } from '../../models';

@Component({
  selector: 'pf-company-tabs',
  templateUrl: './company-tabs.component.html',
  styleUrls: ['./company-tabs.component.scss']
})
export class CompanyTabsComponent implements OnInit, OnDestroy {
  @Input() customCompanySettings: CustomCompanySettings;
  @Input() companyId: number;
  @Input() clientType: string;

  @ViewChild(SecondarySurveyFieldsModalComponent, { static: true })
  secondarySurveyFieldsModalComponent: SecondarySurveyFieldsModalComponent;

  loadingCompanyTiles$: Observable<boolean>;
  loadingCompanyTilesSuccess$: Observable<boolean>;
  loadingCompanyTilesError$: Observable<boolean>;
  companyTiles$: Observable<CompanyTilesResponse[]>;

  loadingCompanySettings$: Observable<boolean>;
  loadingCompanySettingsSuccess$: Observable<boolean>;
  loadingCompanySettingsError$: Observable<boolean>;
  companySettings$: Observable<CompanySetting[]>;

  loadingCompanyDataSets$: Observable<boolean>;
  loadingCompanyDataSetsError$: Observable<boolean>;
  companyDataSets$: Observable<CompanyDataSetsReponse[]>;

  compositeFields$: Observable<ListCompositeFields[]>;
  companyDataSetsEnabled$: Observable<boolean>;

  companyTabsContextSubscription: Subscription;

  constructor( private store: Store<fromPfAdminMainReducer.State> ) {
    this.loadingCompanyTiles$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTiles);
    this.loadingCompanyTilesSuccess$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTilesSuccess);
    this.loadingCompanyTilesError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTilesError);
    this.companyTiles$ = this.store.select(fromPfAdminMainReducer.getCompanyTiles);

    this.loadingCompanySettings$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettings);
    this.loadingCompanySettingsSuccess$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettingsSuccess);
    this.loadingCompanySettingsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettingsError);
    this.companySettings$ = this.store.select(fromPfAdminMainReducer.getCompanySettings);

    this.loadingCompanyDataSets$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSets);
    this.loadingCompanyDataSetsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSetsError);
    this.companyDataSets$ = this.store.select(fromPfAdminMainReducer.getCompanyDataSets);

    this.compositeFields$ = this.store.select(fromPfAdminMainReducer.getCompositeFields);
    this.companyDataSetsEnabled$ = this.store.select(fromPfAdminMainReducer.getCompanyDataSetsEnabled);
  }

  ngOnInit() {
    this.companyTabsContextSubscription = combineLatest(
      this.loadingCompanySettingsSuccess$,
      this.loadingCompanyTilesSuccess$
    ).pipe(
      map(([companyTilesLoaded, companySettingsLoaded]) => {
        return {
          companyTilesLoaded,
          companySettingsLoaded
        };
      })
    ).subscribe(c => this.handleCompanyTabsContextLoaded(c));
  }

  ngOnDestroy() {
    this.companyTabsContextSubscription.unsubscribe();
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

  private handleCompanyTabsContextLoaded(companyTabsContext: CompanyTabsContext) {
    if (!!companyTabsContext && companyTabsContext.companySettingsLoaded && companyTabsContext.companyTilesLoaded) {
      const isEditMode = this.companyId !== -1;
      if (isEditMode) {
        this.store.dispatch(new fromCompanyPageActions.CheckJDMEnabled({ companyId: this.companyId }));
      }
      this.handleTabsDisplayByClientType();
    }
  }

  private handleTabsDisplayByClientType() {
    switch (this.clientType) {
      case CompanyClientTypeConstants.PEER:
        this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
        return;
      case CompanyClientTypeConstants.PEER_AND_ANALYSIS:
        this.store.dispatch(new fromCompanyPageActions.SelectPeerAndAnalysisClientType());
        return;
      default:
        this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());
        return;
    }
  }
}
