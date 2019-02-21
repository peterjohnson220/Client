import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import { CommunityTag } from 'libs/models/community';
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
  trendingTags: CommunityTag[] = [];
  filteredTags: Tag[] = [];
  filteredCategories: CommunityCategoryEnum[] = [];

  constructor(public store: Store<fromCommunityTagReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>,
              public router: Router) {
    this.trendingTags$ = this.store.select(fromCommunityTagReducer.getLoadingCommunityTrendingTagsSuccess);
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.filters$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTagActions.LoadingCommunityTrendingTags());

    this.trendingTagSubscription = this.trendingTags$.subscribe((trending) => {
      this.trendingTags = trending;
    });

    this.filterOptionsSubscription = this.filters$.subscribe((data) => {
      this.filteredTags = data.TagFilter.Tags;
      this.filteredCategories = data.CategoryFilter.Category;
    });
  }

  ngOnDestroy() {
    if (this.trendingTagSubscription) {
      this.trendingTagSubscription.unsubscribe();
    }

    if (this.filterOptionsSubscription) {
      this.filterOptionsSubscription.unsubscribe();
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

  viewAllClicked() {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingAllFilterOptions());
    this.router.navigateByUrl('/dashboard');
  }

  isTrendingTag(tag: Tag) {
    return this.trendingTags.some(trendingTag => trendingTag.Tag === tag.TagName);
  }

  showFilterView() {
    return this.isFilteredByCategory()  || this.isFilteredByNonTrendingTags();
  }

  isFilteredByCategory() {
    return this.filteredCategories.length > 0;
  }

  isFilteredByNonTrendingTags() {
    const filteredNonTrendingTags  = this.filteredTags.filter(item => !this.isTrendingTag(item));
    return filteredNonTrendingTags.length > 0;
  }

  private IsTagSelected(tag: CommunityTag): boolean {
    return this.filteredTags.some (x => x.TagName === tag.Tag);
  }

  private IsCategorySelected(category) {
    return this.filteredCategories.some (filteredCategory => filteredCategory === category);
  }
}
