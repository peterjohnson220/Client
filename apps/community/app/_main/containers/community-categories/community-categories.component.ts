import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { mapToCategoryEnum } from '../../helpers/model-mapping.helper';

import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityCategoriesReducer from '../../reducers';
import * as fromCommunityCategoriesActions from '../../actions/community-categories.actions';
import { CommunityCategory } from 'libs/models/community/community-categories.model';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';

@Component({
  selector: 'pf-community-categories',
  templateUrl: './community-categories.component.html',
  styleUrls: [ './community-categories.component.scss' ]
})
export class CommunityCategoriesComponent implements OnInit {
  categories$: Observable<CommunityCategory[]>;
  categories: CommunityCategory[];

  constructor( private router: Router,
               public store: Store<fromCommunityCategoriesReducer.State>,
               public filterOptionsStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.categories$ = this.store.select(fromCommunityCategoriesReducer.getCommunityCategories);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityCategoriesActions.GettingCommunityCategories());
  }

  onClick(categoryName: string) {
    if (categoryName === CommunityCategoryEnum.JobPostings) {
      this.router.navigate(['/job-postings']);
    } else {
      const categoryEnumValue = mapToCategoryEnum(categoryName);
      this.filterOptionsStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCategoryToFilterOptions(categoryEnumValue));
    }
  }
}
