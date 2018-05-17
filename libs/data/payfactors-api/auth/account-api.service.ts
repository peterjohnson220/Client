import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountApiService {
  private endpoint = 'Account';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  sendPasswordReset(email: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ForgotPassword`, email);
  }

  validateFirstTimeLogin(): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ValidateFirstTimeLogin`);
  }

  updatePassword(password: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.CreateFirstTimePassword`, {password: password});
  }
}
