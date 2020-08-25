import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { HRISConnectionAuthenticationStatus } from 'libs/constants/hris-connection-authenticationstatus';

import * as fromHrisConnectionState from '../reducers/index';
import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import { ConnectionSummary } from '../models';


@Injectable()
export class HrisAuthenticationGuard implements CanActivate, CanActivateChild {
  connectionSummary$: Observable<ConnectionSummary>;

  constructor(
    private router: Router,
    private store: Store<fromHrisConnectionState.State>,
  ) {
    this.connectionSummary$ = this.store.select(fromHrisConnectionState.getHrisConnectionSummary).pipe(
      tap(cs => {
        if (!cs) {
          this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary);
        }
      })
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.connectionSummary$.pipe(filter(cs => !!cs)).switchMap(cs => this.canAccess(cs));
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.connectionSummary$.pipe(filter(cs => !!cs)).switchMap(cs => this.canAccess(cs));
  }

  private canAccess(connectionSummary: ConnectionSummary): Observable<boolean> {
    if (!this.matchesConnectionStatus(HRISConnectionAuthenticationStatus.ERROR , connectionSummary) && !this.matchesConnectionStatus(HRISConnectionAuthenticationStatus.NOTSTARTED, connectionSummary)) {
      return of(true);
    } else {
      this.router.navigate(['/']);
      return of(false);
    }
  }

  private matchesConnectionStatus(status: string, connectionSummary: ConnectionSummary) {
    if (!status) {
      return false;
    }
    return connectionSummary && connectionSummary.statuses.length &&
           connectionSummary.statuses.find(s => s === status);
  }
}
