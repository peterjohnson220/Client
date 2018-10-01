import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../shared/state';
import { UserContext } from '../../../../shared/models/user-context.model';
import { Set } from '../../../../shared/actions/user-context.actions';

@Component({
  selector: 'pf-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePageComponent implements OnInit {
  jobTitle: string;
  location: string;
  userName$: Observable<string>;

  constructor(private store: Store<fromRoot.AppState>) {
    this.userName$ = store.select(fromRoot.selectUserContextModel).pipe(
      map((userContext: UserContext) => (userContext || ({} as UserContext)).name)
    );
  }

  search() {
    console.log(this.jobTitle, this.location);
  }

  ngOnInit() {
    this.store.dispatch(new Set({ emailAddress: 'Test User', name: 'Test User' }));
  }

}
