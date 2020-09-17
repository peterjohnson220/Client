import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCommunityTopicReducer from '../../reducers';
import * as fromCommunityTopicActions from '../../actions/community-topic.actions';
import * as fromCommunityIndustryActions from '../../actions/community-industry.actions';
import * as fromCommunityCompanySizeActions from '../../actions/community-company-size.actions';
import { Observable, Subscription } from 'rxjs';
import { CommunityTopic, CommunityCategory, CommunityCategoryEnum } from 'libs/models/community';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { FilterOptions } from '../../models';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';

@Component({
  selector: 'pf-community-filters',
  templateUrl: './community-filters.component.html',
  styleUrls: [ './community-filters.component.scss' ]
})
export class CommunityFiltersComponent implements OnInit, OnDestroy {
  communityFilterOptions$: Observable<FilterOptions>;

  communityTopics$: Observable<CommunityTopic[]>;
  communityIndustries$: Observable<CommunityIndustry[]>;
  communityCompanySizes$: Observable<CommunityCompanySize[]>;

  filterOptionsSubscription: Subscription;

  topicFilters: any = [];
  industryFilters: any = [];
  companySizeFilters: any = [];

  isFilteredByFavorites: boolean;

  constructor(public store: Store<fromCommunityTopicReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.communityFilterOptions$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);

    this.communityTopics$ = this.store.select(fromCommunityTopicReducer.getTopics);
    this.communityIndustries$ = this.store.select(fromCommunityPostFilterOptionsReducer.getCommunityIndustries);
    this.communityCompanySizes$ = this.store.select(fromCommunityPostFilterOptionsReducer.getCommunityCompanySizes);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTopicActions.LoadingCommunityTopics());
    this.store.dispatch(new fromCommunityIndustryActions.LoadingCommunityIndustries());
    this.store.dispatch(new fromCommunityCompanySizeActions.LoadingCommunityCompanySizes());

    this.filterOptionsSubscription = this.communityFilterOptions$.subscribe(response => {
      if (response) {
        this.topicFilters = response.TopicFilter.Topics;
        this.industryFilters = response.IndustryFilter.Industries;
        this.companySizeFilters = response.CompanySizeFilter.CompanySizes;
        this.isFilteredByFavorites = response.CategoryFilter.Category.find(x => x === CommunityCategoryEnum.MyFavorites) ? true : false;
      }
    });
  }

  ngOnDestroy() {
    this.filterOptionsSubscription.unsubscribe();
  }

  topicsSelected(topics) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.ChangingCommunityTopicFilterOptions(topics));
  }

  industriesSelected(industries) {
    this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityIndustryToFilterOptions(industries));
  }

  companySizesSelected(companySizes) {
    this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCompanySizeToFilterOptions(companySizes));
  }

  onFilterByFavoritesClick() {
    if (!this.isFilteredByFavorites) {
      this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCategoryToFilterOptions(CommunityCategoryEnum.MyFavorites));
    } else {
      this.store.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(CommunityCategoryEnum.MyFavorites));
    }
  }
}



