import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { environment } from 'environments/environment';

@Injectable()
export class RegistrationEnabledGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!environment.allowSelfRegistration) {
      this.router.navigate(['/notfound']);
      return false;
    }
    return true;
  }
}
