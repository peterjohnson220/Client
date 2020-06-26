import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CompanySelectorItem } from 'libs/features/company/models';
import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import { SurveyTitle, SurveyTitleResponseModel, SurveyTitlesFilter } from '../../models';
import * as fromSurveyLibraryReducer from '../../reducers';
import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import * as fromSurveyTitlesActions from '../../actions/survey-titles.actions';

@Component({
  selector: 'pf-survey-titles-page',
  templateUrl: './survey-titles.page.html',
  styleUrls: ['./survey-titles.page.scss']
})

export class SurveyTitlesPageComponent implements OnInit {
  @ViewChild('TitleSearch') titleSearch;
  public filter: SurveyTitlesFilter;
  public publisher: string;
  public systemUserGroupsId: number;
  private filterModelChanged: Subject<string> = new Subject<string>();
  public surveyTitles: SurveyTitle[];
  public publisherId: number;
  isCollapsed: boolean;
  searchTerm: string;

  public surveyTitles$: Observable<SurveyTitleResponseModel>;
  private userContext$: Observable<UserContext>;
  public companies$: Observable<CompanySelectorItem[]>;
  public loadingSurveyTitles$: Observable<boolean>;
  private surveyTitleModalOpen$: BehaviorSubject<boolean>;
  private saveSurveyTitleSuccess$: Observable<boolean>;

  constructor(private activeRoute: ActivatedRoute,
    private store: Store<fromSurveyLibraryReducer.State>,
    private state: SurveyLibraryStateService) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.companies$ = store.select(fromSurveyLibraryReducer.getCompanies);
    this.surveyTitles$ = this.store.select(fromSurveyLibraryReducer.getSurveyTitles);
    this.loadingSurveyTitles$ = this.store.select(fromSurveyLibraryReducer.getLoadingSurveyTitles);
    this.surveyTitleModalOpen$ = new BehaviorSubject<boolean>(false);
    this.saveSurveyTitleSuccess$ = this.store.select(fromSurveyLibraryReducer.getSavingSurveyTitlesSuccess);
    this.filter = { SearchTerm: '', CompanyId: undefined };
    this.publisherId = activeRoute.snapshot.params.id;
    this.isCollapsed = true;

    this.filterModelChanged.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(searchTerm =>
        this.getSurveyTitles()
      );
  }

  ngOnInit(): void {
    this.store.dispatch(new fromCompanySelectorActions.GetCompanies);
    this.getSurveyTitles();
    this.userContext$.subscribe(userContext => {
      this.systemUserGroupsId = userContext.CompanySystemUserGroupsId;
    });

    this.surveyTitles$.subscribe(payload => {
      if (payload) {
        this.publisher = payload.PublisherName;
        this.surveyTitles = payload.PublisherTitles;
      }
    });

    this.saveSurveyTitleSuccess$.subscribe(isSuccess => {
      if (isSuccess) {
        this.searchTerm = '';
      }
    });
  }

  getSurveyTitles(): void {
    this.store.dispatch(new fromSurveyTitlesActions.LoadingSurveyTitles({ publisherId: this.publisherId, filter: this.filter }));
  }

  filterChanged(searchTerm: string) {
    this.filter = {
      SearchTerm: searchTerm,
      CompanyId: this.filter.CompanyId
    };
    this.filterModelChanged.next(searchTerm);
  }

  openModal() {
    this.state.setAddSurveyTitleModalOpen(true);
  }

  returnToPublishers() {
    document.location.href = '/marketdata/admin/surveypublishers.asp';
  }

  companySelectionChange($event: any) {
    this.filter = {
      SearchTerm: this.filter.SearchTerm,
      CompanyId: $event ? $event.CompanyId : undefined
    };
    this.getSurveyTitles();
  }
}
