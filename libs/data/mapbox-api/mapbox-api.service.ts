import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CommunityJob } from 'libs/models/community/community-job.model';
import { CommunityJobSearchResponse } from 'libs/models/community/community-job-search-response.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MapboxApiService {
  private endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  private types = 'place';
  private resultLimit = 4;

  constructor(private http: HttpClient) {
  }

  getLocationResults(payload: any, accessToken: string): Observable<any> {
    return this.http.get<string>(this.getFormattedEndpoint(payload, accessToken)).pipe(
      map(this.extractValueFromResponse)
    );
  }

  private getFormattedEndpoint(payload: any, accessToken: string) {
    return `${this.endpoint}${payload}.json?types=${this.types}&limit=${this.resultLimit}&access_token=${accessToken}`;
  }

  private extractValueFromResponse(response: any) {
    if (response === null) {
      return null;
    }

    return typeof response.value !== 'undefined' ? response.value : false || response || {};
  }
}

