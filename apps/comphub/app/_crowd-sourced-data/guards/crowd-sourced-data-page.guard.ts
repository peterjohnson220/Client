import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

@Injectable()
export class CrowdSourcedDataPageGuard implements CanActivate, OnDestroy {
  hasCrowdSourcedDataSub: Subscription;
  unsubscribe$ = new Subject<void>();

  constructor(
    private settingsService: SettingsService,
    private store: Store<fromRootState.State>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const hasAccess = this.waitForCompanySettingsLoadAttempt().pipe(
      switchMap(() =>
        this.settingsService.selectCompanySetting<boolean>(
          CompanySettingsEnum.CrowdSourcedData
        ).pipe(
          map(setting => !!setting),
          take(1)
        )
      )
    );
    if (!hasAccess) {
      this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }

  private waitForCompanySettingsLoadAttempt() {
    return this.store.select(fromRootState.getCompanySettingsLoadAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }

  ngOnDestroy(): void {
    this.hasCrowdSourcedDataSub.unsubscribe();
  }
}
