import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';
import { Store } from '@ngrx/store';
import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pf-survey-titles-page',
  templateUrl: './survey-titles.page.html',
  styleUrls: ['./survey-titles.page.scss']
})

export class SurveyTitlesPageComponent implements OnInit {
  @ViewChild('TitleSearch', {static: false}) titleSearch;
  public filter: string;
  public publisher: string;
  public systemUserGroupsId: number;
  private filterModelChanged: Subject<string> = new Subject<string>();
  public surveyTitles: any;
  public readonly publisherId: number;
  private userContext$: Observable<UserContext>;
  private surveyTitleModalOpen$: BehaviorSubject<boolean>;

  constructor(private activeRoute: ActivatedRoute,
              private surveyLibraryApiService: SurveyLibraryApiService,
              private store: Store<fromRootState.State>,
              private state: SurveyLibraryStateService) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.surveyTitleModalOpen$ = new BehaviorSubject<boolean>(false);
    this.publisherId = activeRoute.snapshot.params.id;

    this.filterModelChanged.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(filter => this.getSurveyTitles(this.publisherId, filter));
  }

  ngOnInit(): void {
    this.getSurveyTitles(this.publisherId, '');
    this.userContext$.subscribe(userContext => {
      this.systemUserGroupsId = userContext.CompanySystemUserGroupsId;
    });
  }

  getSurveyTitles(publisherId: number, filter: string): void {
    this.surveyLibraryApiService.getSurveyTitlesByPublisherId(publisherId, filter).subscribe(value => {
      this.surveyTitles = value;
      this.publisher = this.surveyTitles[0].PublisherName;
    });
  }

  filterChanged(filter: string) {
    this.filterModelChanged.next(filter);
  }

  openModal() {
    this.state.setAddSurveyTitleModalOpen(true);
  }
}
