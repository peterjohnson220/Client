import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { CustomerConnection } from '../../../models/sso';
import { Observable } from 'rxjs';



@Injectable()
export class SsoConfigApiService {
  private endpoint = 'SsoConfiguration';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  createCustomerSsoConnection(customerConnection: CustomerConnection ): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.CreateCustomerConnection`, customerConnection,
      (response) => response.value);
  }
}
