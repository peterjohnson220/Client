import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '../../shared/models/location';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LocationService {

  locationTypes = { region: 'region', state: 'state', metro: 'metro', city: 'city' };

  constructor(private httpClient: HttpClient) { }

  search(searchTerm = ''): Observable<Location[]> {
    const baseApiUrl = environment.smallBusinessApiUrl;
    const url = `${baseApiUrl}location?searchTerm=${searchTerm}`;

    return this.httpClient.get(url).pipe(
      map((response: Location[]) => {
        return response.map(location => {
          return {
            ...location,
            // disambiguate duplicate city names, eg show 'Boston, Ma' not 'Boston' if the location type is city
            name: (location.locationType === this.locationTypes.city) ? `${location.name}, ${location.state}` : location.name
          } as Location;
        });
      })
    );
  }
}
