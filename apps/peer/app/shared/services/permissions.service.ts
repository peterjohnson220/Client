import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';

@Injectable()
export class PermissionApiService {
    private endpoint = 'PeerAuth';

    constructor(private payfactorsApiService: PayfactorsApiService) { }

    getExchangeAccess(): Observable<number[]> {
        return this.payfactorsApiService.get<number[]>(`${this.endpoint}/GetExchangeAccess`);
    }
}
