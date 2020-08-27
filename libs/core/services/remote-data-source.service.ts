import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';

import {PayfactorsApiService} from '../../data/payfactors-api/payfactors-api.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteDataSourceService {
  private cache = [];
  constructor(
    private payfactorsApiService: PayfactorsApiService,
  ) { }

  getDataSource(apiUrl: string) {
    if (!this.cache[apiUrl]) {
      this.cache[apiUrl] = this.payfactorsApiService.get<any>(apiUrl).pipe(
        shareReplay(1)
      );
    }
    return this.cache[apiUrl];
  }
}
