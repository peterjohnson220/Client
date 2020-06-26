import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HospitalitySignupForm } from 'libs/models/form';
import { FormSubmissionResponse, ExchangeSignupCompany } from 'libs/models/payfactors-api/form';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeSignupFormApiService {
  private readonly endpoint = 'ExchangeSignupForm';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  submitHospitalitySignup(signupForm: HospitalitySignupForm): Observable<FormSubmissionResponse> {
    return this.payfactorsApiService.post<FormSubmissionResponse>(`${this.endpoint}/HospitalitySignup`, signupForm);
  }

  getExchangeSignupCompanies(exchangeName: string): Observable<ExchangeSignupCompany[]> {
    return this.payfactorsApiService.get<ExchangeSignupCompany[]>(`${this.endpoint}/GetExchangeSignupCompanies?exchangeName=${exchangeName}`);
  }
}
