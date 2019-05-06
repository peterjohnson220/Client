import {Injectable} from '@angular/core';
import 'rxjs-compat/add/observable/of';
import {Observable} from 'rxjs/Observable';

import {PayfactorsApiService} from '../../data/payfactors-api/payfactors-api.service';



@Injectable()
export class RemoteDataSourceService {
  private apiResponseDictionary = [];
  constructor(
    private payfactorsApiService: PayfactorsApiService,
  ) { }

  getDataSource(apiUrl: string) {
    const currentItem = this.apiResponseDictionary.find(a => a.Name === apiUrl)
    if (currentItem) {
      return Observable.of(currentItem.Items);

    } else {
      const api =  this.payfactorsApiService.get<any>(apiUrl);
      api.subscribe(items => {
        this.apiResponseDictionary.push({Name: apiUrl, Items: items});
      });
      return api;
    }
  }
}
