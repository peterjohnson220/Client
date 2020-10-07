import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';
import { RegistrationForm } from '../../../models/user/registration-form.model';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private endpoint = 'Account';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  sendPasswordReset(email: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ForgotPassword`, email);
  }

  checkPasswordResetToken(token: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.CheckResetPasswordToken`, {token: token});
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ResetPassword`, {token: token, password: password});
  }

  validateFirstTimeLogin(): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ValidateFirstTimeLogin`);
  }

  updatePassword(password: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.CreateFirstTimePassword`, {password: password});
  }

  login(loginParms: any): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.Login`, loginParms );
  }

  getLoginSettings(): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetLoginSettings`);
  }

  submitSelfRegistrationRequest(selfRegistrationForm: RegistrationForm): Observable<any> {
    const payload = { Request: { ...selfRegistrationForm } };
    return this.payfactorsApiService.post<any>(`${this.endpoint}.SelfRegistrationRequest`, payload);
  }

  validateSelfRegistrationToken(token: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ValidateSelfRegistration`, { token });
  }

  submitSelfRegistrationCompletion(token: string, password: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.CompleteSelfRegistration`, { token, password });
  }

  resendSelfRegistrationToken(token: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ResendSelfRegistrationRequest`, { token });
  }

  authenticateSSOParams(tokenId: string, agentId: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/JwtSsoAuthHandler?tokenid=${tokenId}&agentid=${agentId}`);
  }
}
