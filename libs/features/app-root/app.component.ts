import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from '../../state/state';

@Component({
  selector: 'pf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class.ready') ready = false;

  hasUserContext$: Observable<boolean>;
  hasUserContextSub: Subscription;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.hasUserContext$ = this.store.select(fromRootState.hasUserContext);
  }

  ngOnInit(): void {
    this.hasUserContextSub = this.hasUserContext$.subscribe(huc => this.ready = huc);
  }

  ngOnDestroy(): void {
    this.hasUserContextSub.unsubscribe();
  }
}
