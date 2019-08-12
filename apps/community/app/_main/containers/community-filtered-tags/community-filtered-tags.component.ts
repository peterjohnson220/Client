import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import { CommunityPost, CommunityTag } from 'libs/models/community';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { FilterOptions } from 'apps/community/app/_main/models/filter-options.model';
import { Tag, Topic } from '../../models';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';

@Component({
  selector: 'pf-community-filtered-tags',
  templateUrl: './community-filtered-tags.component.html',
  styleUrls: [ './community-filtered-tags.component.scss' ]
})
export class CommunityFilteredTagsComponent implements OnInit, OnDestroy {
  filteredByPost$: Observable<boolean>;
  filters$: Observable<FilterOptions>;
  filterOptionsSubscription: Subscription;
  filterTitleSubscription: Subscription;
  filteredTags: Tag[] = [];
  filteredCategories: CommunityCategoryEnum[] = [];
  filteredIndustries: CommunityIndustry[] = [];
  filteredCompanySizes: CommunityCompanySize[] = [];
  filteredTopics: Topic[] = [];
  isFilteredByPostId = false;
  isFilteredByReplyId = false;
  communityPosts$: Observable<CommunityPost[]>;
  filterTitle$: Observable<any>;
  filterTitle: string;

  constructor(public store: Store<fromCommunityTagReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>,
              public router: Router) {
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.filters$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
    this.communityPosts$ = this.store.select(fromCommunityTagReducer.getCommunityPostsCombinedWithReplies);
    this.filterTitle$ = this.store.select(fromCommunityTagReducer.getFilterTitle);
  }

  ngOnInit() {

    this.filterOptionsSubscription = this.filters$.subscribe((data) => {
      this.filteredTags = data.TagFilter.Tags;
      this.filteredCategories = data.CategoryFilter.Category;
      this.filteredIndustries = data.IndustryFilter.Industries;
      this.filteredCompanySizes = data.CompanySizeFilter.CompanySizes;
      this.filteredTopics = data.TopicFilter.Topics;
      this.isFilteredByPostId = data.PostIds.length > 0;
      this.isFilteredByReplyId = data.ReplyIds.length > 0;
    });

    this.filterTitleSubscription = this.filterTitle$.subscribe(data => {
      this.filterTitle = data;
    });
  }

  ngOnDestroy() {

    if (this.filterOptionsSubscription) {
      this.filterOptionsSubscription.unsubscribe();
    }

    if (this.filterTitleSubscription) {
      this.filterTitleSubscription.unsubscribe();
    }
  }

  tagClicked(filteredTag: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(filteredTag));
  }

  categoryFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(filter));
  }

  topicFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTopicFromFilterOptions(filter));
  }

  industryFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityIndustryFromFilterOptions(filter));
  }

  companySizeFilterClicked(filter: any) {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityCompanySizeFromFilterOptions(filter));
  }

  viewAllClicked() {
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingAllFilterOptions());
    this.router.navigateByUrl('/dashboard');
  }

  showFilterView() {
    return this.isFilteredByCategory()
      || this.isFilteredByTag()
      || this.isFilteredByIndustry()
      || this.isFilteredByTopic()
      || this.isFilteredByPostId
      || this.isFilteredByReplyId;
  }

  isFilteredByTag() {
    return this.filteredTags.length > 0;
  }

  isFilteredByCategory() {
    return this.filteredCategories.length > 0;
  }

  isFilteredByIndustry() {
    return this.filteredIndustries.length > 0;
  }

  isFilteredByCompanySize() {
    return this.filteredCompanySizes.length > 0;
  }

  isFilteredByTopic() {
    return this.filteredTopics.length > 0;
  }

  private IsTagSelected(tag: CommunityTag): boolean {
    return this.filteredTags.some(x => x.TagName === tag.Tag);
  }

  private IsCategorySelected(category) {
    return this.filteredCategories.some(filteredCategory => filteredCategory === category);
  }

  private IsTopicSelected(topic) {
    return this.filteredTopics.some(filteredTopic => filteredTopic === topic);
  }

  private IsIndustrySelected(industry) {
    return this.filteredIndustries.some(filteredIndustry => filteredIndustry === industry);
  }

  private IsCompanySizeSelected(companySize) {
    return this.filteredCompanySizes.some(filteredCompanySize => filteredCompanySize === companySize);
  }
}
