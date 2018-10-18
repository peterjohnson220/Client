import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
               public store: Store<fromCommunityCategoriesReducer.State>) {
    this.categories$ = this.store.select(fromCommunityCategoriesReducer.getCommunityCategories);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityCategoriesActions.GettingCommunityCategories());
  }

  categoryClick(categoryName: string) {
    if (categoryName === CommunityCategoryEnum.JobPostings) {
      this.router.navigate(['/job-postings']);
    } else {
      // TODO: add community posts filtering code part of BT-195
    }
  }
}
