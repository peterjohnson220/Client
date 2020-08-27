import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { FooterViewRequest } from 'libs/models/payfactors-api';

@Injectable({
  providedIn: 'root',
})
export class JobDescriptionFooterViewApiService {
    private apiUrl = 'JobDescriptionFooterView';

    constructor(private apiService: PayfactorsApiService) { }

    getFooterView() {
      return this.apiService.get(`${this.apiUrl}/GetFooterView`);
    }

    saveFooterView(payload: FooterViewRequest) {
      return this.apiService.post(`${this.apiUrl}/SaveFooterView`, payload);
    }
}
