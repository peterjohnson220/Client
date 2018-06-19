import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { MarketingImageDto } from '../../../models/marketing/marketing-image-dto.model';

@Injectable()
export class MarketingApiService {
  private endpoint = 'Marketing';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMarketingImage() {
    return this.payfactorsApiService.get<MarketingImageDto>(`${this.endpoint}.GetMarketingImage`);
  }
}
