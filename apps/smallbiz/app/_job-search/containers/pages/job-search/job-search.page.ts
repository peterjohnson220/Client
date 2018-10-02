import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../shared/state';
import * as fromJobSearch from '../../../reducers';
import * as fromJobSearchActions from '../../../actions/job-search.actions';
import { Set } from '../../../../shared/actions/user-context.actions';

import { UserContext } from '../../../../shared/models/user-context.model';
import { JobTitle } from '../../../../shared/models/jobTitle';

@Component({
  selector: 'pf-job-search-page',
  templateUrl: './job-search.page.html',
  styleUrls: ['./job-search.page.scss']
})
export class JobSearchPageComponent implements OnInit {
  jobTitle: string;
  location: string;
  results$: Observable<JobTitle[]>; // TODO this should probably be in it's own component
  userName$: Observable<string>;

  constructor(private store: Store<fromRoot.AppState>) {
    this.userName$ = store.select(fromRoot.selectUserContextModel).pipe(
      map((userContext: UserContext) => (userContext || ({} as UserContext)).name)
    );
    this.results$ = store.select(fromJobSearch.selectSearchResults);
  }

  search() {
    this.store.dispatch(new fromJobSearchActions.JobSearch({ searchTerm: this.jobTitle || '' }));
  }

  ngOnInit() {
    this.store.dispatch(new Set({ emailAddress: 'Test User', name: 'Test User' }));
  }

}
