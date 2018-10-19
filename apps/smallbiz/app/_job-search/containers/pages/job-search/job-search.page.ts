import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../shared/state';
import * as fromJobSearch from '../../../reducers';
import * as fromJobSearchActions from '../../../actions/job-search.actions';
import { Set } from '../../../../shared/actions/user-context.actions';

import { UserContext } from '../../../../shared/models';
import { Job, JobSearchResult } from '../../../models';

@Component({
  selector: 'pf-job-search-page',
  templateUrl: './job-search.page.html',
  styleUrls: ['./job-search.page.scss']
})
export class JobSearchPageComponent implements OnInit {
  searchResults$: Observable<Job[]>;
  userName$: Observable<string>;

  constructor(private store: Store<fromJobSearch.State>) {
    this.userName$ = store.select(fromRoot.selectUserContextModel).pipe(
      map((userContext: UserContext) => (userContext || ({} as UserContext)).name)
    );
    this.searchResults$ = store.select(fromJobSearch.selectSearchResult).pipe(
      map((result: JobSearchResult) => !!result ? result.jobs : [])
    );
  }

  onSearchTermChange(searchTerm: string) {
    this.store.dispatch(new fromJobSearchActions.JobSearch({ searchTerm }));
  }

  onJobSelected(selected: Job) {
    this.store.dispatch(new fromJobSearchActions.JobSelected({ selected }));
  }

  ngOnInit() {
    this.store.dispatch(new Set({ emailAddress: 'Test User', name: 'Test User' }));
  }

}
