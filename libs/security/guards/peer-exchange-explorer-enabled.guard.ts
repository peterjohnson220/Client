import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { CompanySettingsEnum } from '../../models/company';
import { SettingsService } from '../../state/app-context/services';

@Injectable()
export class PeerExchangeExplorerEnabledGuard implements CanActivate {
  peerExchangeExplorerEnabled$: Observable<boolean|null>;

  constructor(private router: Router, private settingsService: SettingsService) {
    this.peerExchangeExplorerEnabled$ = this.settingsService.selectCompanySetting(
      CompanySettingsEnum.PeerExchangeExplorerEnabled
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.peerExchangeExplorerEnabled$.pipe(
      filter(x => x !== null),
      mergeMap(setting => {
        if (setting) {
          return of(this.router.createUrlTree(
            [state.url.split('?')[0], 'new'],
            {queryParams: route.queryParams}
            ));
        }
        return of(true);
      })
    );
  }
}
