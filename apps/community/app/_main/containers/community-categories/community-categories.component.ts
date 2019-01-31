import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { mapToCategoryEnum } from '../../helpers/model-mapping.helper';

import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityCategoriesReducer from '../../reducers';
import * as fromCommunityCategoriesActions from '../../actions/community-categories.actions';
import { CommunityCategory } from 'libs/models/community/community-categories.model';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { FilterOptions } from 'apps/community/app/_main/models/filter-options.model';

@Component({
  selector: 'pf-community-categories',
  templateUrl: './community-categories.component.html',
  styleUrls: [ './community-categories.component.scss' ]
})
export class CommunityCategoriesComponent implements OnInit, OnDestroy {
  categories$: Observable<CommunityCategory[]>;
  selectedCategories: string[];
  filteredByPost$: Observable<boolean>;
  filteredByPostSubscription: Subscription;
  filters$: Observable<FilterOptions>;
  filterOptionsSubscription: Subscription;
  filteredByPost = false;

  constructor( private router: Router,
               public store: Store<fromCommunityCategoriesReducer.State>,
               public filterOptionsStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.categories$ = this.store.select(fromCommunityCategoriesReducer.getCommunityCategories);
    this.filteredByPost$ = this.filterOptionsStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.filters$ = this.store.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityCategoriesActions.GettingCommunityCategories());
    this.filteredByPostSubscription = this.filteredByPost$.subscribe(filter => {
      if (filter) {
        this.filteredByPost = filter;
      }
    });

    this.filterOptionsSubscription = this.filters$.subscribe((data) => {
      this.selectedCategories = data.CategoryFilter.Category;
  });
  }

  ngOnDestroy() {
    if (this.filteredByPostSubscription) {
      this.filteredByPostSubscription.unsubscribe();
    }

    if (this.filterOptionsSubscription) {
      this.filterOptionsSubscription.unsubscribe();
    }
  }

  onClick(categoryName: string) {
    if (categoryName === CommunityCategoryEnum.JobPostings) {
      this.router.navigate(['/job-postings']);
    } else {
      const categoryEnumValue = mapToCategoryEnum(categoryName);
      this.filterOptionsStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCategoryToFilterOptions(categoryEnumValue));
    }
  }

  private IsCategorySelected(category: string): boolean {
    return this.selectedCategories.some (x => x === category);
  }
}
