import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCommunityTopicReducer from '../../reducers';
import * as fromCommunityTopicActions from '../../actions/community-topic.actions';
import { Observable, Subscription } from 'rxjs';
import { CommunityTopic } from 'libs/models/community';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { FilterOptions } from '../../models';

@Component({
  selector: 'pf-community-filters',
  templateUrl: './community-filters.component.html',
  styleUrls: [ './community-filters.component.scss' ]
})
export class CommunityFiltersComponent implements OnInit, OnDestroy {
  communityTopics$: Observable<CommunityTopic[]>;
  deletingCommunityTopicSuccess$: Observable<boolean>;
  communityFilterOptions$: Observable<FilterOptions>;

  deleteCommunityTopicSubscription: Subscription;
  filterOptionsSubscription: Subscription;

  selectedTopics: any = [];
  topicFilters: any = [];

  constructor(public store: Store<fromCommunityTopicReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.communityTopics$ = this.store.select(fromCommunityTopicReducer.getTopics);
    this.deletingCommunityTopicSuccess$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getDeletingCommunityTopicSuccess);
    this.communityFilterOptions$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTopicActions.LoadingCommunityTopics());

    this.filterOptionsSubscription = this.communityFilterOptions$.subscribe(response => {
      if (response) {
        this.topicFilters = response.TopicFilter.Topics;
      }
    });

    this.deleteCommunityTopicSubscription = this.deletingCommunityTopicSuccess$.subscribe(response => {
      if (response) {
        this.selectedTopics = this.topicFilters;
      }
    });
  }

  ngOnDestroy() {
    if (this.filterOptionsSubscription) {
      this.filterOptionsSubscription.unsubscribe();
    }

    if (this.deleteCommunityTopicSubscription) {
      this.deleteCommunityTopicSubscription.unsubscribe();
    }
  }

  topicsSelected(topics) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.ChangingCommunityTopicFilterOptions
    (topics));
  }
}



