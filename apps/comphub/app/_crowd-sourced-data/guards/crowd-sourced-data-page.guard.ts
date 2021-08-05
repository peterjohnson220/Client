import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';


@Injectable()
export class CrowdSourcedDataPageGuard implements CanActivate, OnDestroy {
  hasCrowdSourcedDataSub: Subscription;
  hasCrowdSourcedData: boolean;
  unsubscribe$ = new Subject<void>();

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.hasCrowdSourcedDataSub = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.CrowdSourcedData
    ).subscribe(x => {
      if (x !== null) {
        this.hasCrowdSourcedData = x;
      } else {
        this.hasCrowdSourcedData = false;
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.hasCrowdSourcedData) {
      this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.hasCrowdSourcedDataSub.unsubscribe();
  }
}
