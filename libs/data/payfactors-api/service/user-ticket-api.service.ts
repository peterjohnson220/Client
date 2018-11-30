import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserTicketApiService {
  private endpoint = 'UserTicket';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  createUserTicket(uploadData: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.CreateUserTicket`, uploadData);
  }
}
