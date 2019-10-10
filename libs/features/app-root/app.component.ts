import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRootState from '../../state/state';
import { NewRelicService } from '../../core/services';
import { UserContext } from '../../models/security';

@Component({
  selector: 'pf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class.ready') ready = false;

  hasUserContext$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  hasUserContextSub: Subscription;
  userContextSub: Subscription;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.hasUserContext$ = this.store.select(fromRootState.hasUserContext);
    this.userContext$ = this.store.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.hasUserContextSub = this.hasUserContext$.subscribe(huc => this.ready = huc);
    this.userContextSub = this.userContext$.pipe(filter(uc => !!uc)).subscribe(uc => {
      NewRelicService.setCustomAttributes(uc.CompanyId, uc.UserId, uc.IpAddress, uc.SessionId);
    });
  }

  ngOnDestroy(): void {
    this.hasUserContextSub.unsubscribe();
    this.userContextSub.unsubscribe();
  }
}
