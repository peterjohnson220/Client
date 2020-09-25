import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { MarketingImageDto } from '../../../models/marketing/marketing-image-dto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketingApiService {
  private endpoint = 'MarketingSettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMarketingImage() {
    return this.payfactorsApiService.get<MarketingImageDto>(`${this.endpoint}.GetMarketingImage`);
  }

  updateMarketingSettings(payload: any): Observable<boolean> {
    return (this.payfactorsApiService.post<boolean>(`${this.endpoint}.UpdateMarketingSettings`, payload));
  }

  getMarketingVideoUrl() {
    return this.payfactorsApiService.get<string>(`${this.endpoint}.GetMarketingVideoUrl`);
  }

}
