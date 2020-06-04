import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { IntlService } from '@progress/kendo-angular-intl';

@Injectable()
export class ValidDateGuard implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private intlService: IntlService
  ) {}


  canActivate(route: ActivatedRouteSnapshot): boolean {
    const validDate = this.intlService.parseDate(route.params.date);
    if (validDate == null || validDate > this.getMaxDate()) {
      // date invalid for employee history
      this.router.navigate(['not-found'], { relativeTo: this.route });
      return false;
    }
    return true;
  }

  private getMaxDate(): Date {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
}
