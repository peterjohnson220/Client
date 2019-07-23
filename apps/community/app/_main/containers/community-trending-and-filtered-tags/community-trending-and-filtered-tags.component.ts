import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import { CommunityPost, CommunityTag } from 'libs/models/community';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';
import { FilterOptions } from 'apps/community/app/_main/models/filter-options.model';
import { Tag } from '../../models';

@Component({
  selector: 'pf-community-trending-and-filtered-tags',
  templateUrl: './community-trending-and-filtered-tags.component.html',
  styleUrls: ['./community-trending-and-filtered-tags.component.scss']
})
export class CommunityTrendingAndFilteredTagsComponent implements OnInit, OnDestroy {
  trendingTags$: Observable<CommunityTag[]>;
  filteredByPost$: Observable<boolean>;
  filters$: Observable<FilterOptions>;
  filterOptionsSubscription: Subscription;
  trendingTagSubscription: Subscription;
  filterTitleSubscription: Subscription;
  trendingTags: CommunityTag[] = [];
  filteredTags: Tag[] = [];
  filteredCategories: CommunityCategoryEnum[] = [];
  filteredIndustries: string[] = [];
  isFilteredByPostId = false;
  isFilteredByReplyId = false;
  communityPosts$: Observable<CommunityPost[]>;
  filterTitle$: Observable<any>;
  filterTitle: string;

  constructor(public store: Store<fromCommunityTagReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>,
              public router: Router) {
    this.trendingTags$ = this.store.select(fromCommunityTagReducer.getLoadingCommunityTrendingTagsSuccess);
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.filters$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
    this.communityPosts$ = this.store.select(fromCommunityTagReducer.getCommunityPostsCombinedWithReplies);
    this.filterTitle$ = this.store.select(fromCommunityTagReducer.getFilterTitle);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTagActions.LoadingCommunityTrendingTags());

    this.trendingTagSubscription = this.trendingTags$.subscribe((trending) => {
      this.trendingTags = trending;
    });

    this.filterOptionsSubscription = this.filters$.subscribe((data) => {
      this.filteredTags = data.TagFilter.Tags;
      this.filteredCategories = data.CategoryFilter.Category;
      this.filteredIndustries = data.IndustryFilter.Industry;
      this.isFilteredByPostId = data.PostIds.length > 0;
      this.isFilteredByReplyId = data.ReplyIds.length > 0;
    });

    this.filterTitleSubscription = this.filterTitle$.subscribe(data => {
      this.filterTitle = data;
    });
  }

  ngOnDestroy() {
    if (this.trendingTagSubscription) {
      this.trendingTagSubscription.unsubscribe();
    }

    if (this.filterOptionsSubscription) {
      this.filterOptionsSubscription.unsubscribe();
    }

    if (this.filterTitleSubscription) {
      this.filterTitleSubscription.unsubscribe();
    }
  }

  trendingTagClicked(trendingTag: CommunityTag) {
    const tag = mapCommunityTagToTag(trendingTag);
    if ( ! this.IsTagSelected (trendingTag)) {
      this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(tag));
    } else {
      this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(tag));
    }
  }

  nonTrendingTagClicked(filteredTag: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(filteredTag));
  }

  categoryFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(filter));
  }

  industryFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityIndustryFromFilterOptions(filter));
  }

  viewAllClicked() {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingAllFilterOptions());
    this.router.navigateByUrl('/dashboard');
  }

  isTrendingTag(tag: Tag) {
    return this.trendingTags.some(trendingTag => trendingTag.Tag === tag.TagName);
  }

  showFilterView() {
    return this.isFilteredByCategory()
    || this.isFilteredByNonTrendingTags()
    || this.isFilteredByIndustry()
    || this.isFilteredByPostId
    || this.isFilteredByReplyId;
  }

  isFilteredByCategory() {
    return this.filteredCategories.length > 0;
  }

  isFilteredByNonTrendingTags() {
    const filteredNonTrendingTags  = this.filteredTags.filter(item => !this.isTrendingTag(item));
    return filteredNonTrendingTags.length > 0;
  }

  isFilteredByIndustry() {
    return this.filteredIndustries.length > 0;
  }


  private IsTagSelected(tag: CommunityTag): boolean {
    return this.filteredTags.some (x => x.TagName === tag.Tag);
  }

  private IsCategorySelected(category) {
    return this.filteredCategories.some (filteredCategory => filteredCategory === category);
  }

  private IsIndustrySelected(industry) {
    return this.filteredIndustries.some (filteredIndustry => filteredIndustry === industry);
  }
}
