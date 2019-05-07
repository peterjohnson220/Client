import {Injectable} from '@angular/core';
import 'rxjs-compat/add/observable/of';

import {PayfactorsApiService} from '../../data/payfactors-api/payfactors-api.service';

@Injectable()
export class RemoteDataSourceService {
  constructor(
    private payfactorsApiService: PayfactorsApiService,
  ) { }

  getDataSource(apiUrl: string) {
    return this.payfactorsApiService.get<any>(apiUrl);
  }
}
