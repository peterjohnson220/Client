import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ProductAsset } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ProductAssetsApiService {
  private endpoint = 'ProductAsset';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getProductAssets(): Observable<ProductAsset[]> {
    return this.payfactorsApiService.get<ProductAsset[]>(`${this.endpoint}/Default.GetProductAssets`);
  }
}
