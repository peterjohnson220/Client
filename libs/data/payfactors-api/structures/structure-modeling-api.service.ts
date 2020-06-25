import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  SaveModelSettingsRequest,
  SaveModelSettingsResponse,
  RecalcAndSaveRangeMinMaxRequest,
  RecalcAndSaveRangeMinMaxResponse,
  StructureRangeGroupResponse,
  RecalculateRangesWithoutMidRequest,
  AddJobRangesRequest,
  JobSearchRequestStructuresRangeGroup,
  RemoveRangeRequest
} from 'libs/models/payfactors-api';
import { CompanyStructureRange } from 'libs/models/structures';

import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class StructureModelingApiService {
  private readonly endpoint = 'StructureModeling';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStructureNameAutocompleteSuggestions(filter: string): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/GetStructureNameAutocompleteSuggestions`, {
      params: { filter }
    });
  }

  saveModelSettings(request: SaveModelSettingsRequest): Observable<SaveModelSettingsResponse> {
    return this.payfactorsApiService.post<SaveModelSettingsResponse>(`${this.endpoint}/SaveModelSettings`, request );
  }

  recalculateRangeMinMax(request: RecalcAndSaveRangeMinMaxRequest): Observable<RecalcAndSaveRangeMinMaxResponse> {
    return this.payfactorsApiService.post<RecalcAndSaveRangeMinMaxResponse>(`${this.endpoint}/RecalculateRangeMinMax`, request);
  }

  recalculateRangesWithoutMid(request: RecalculateRangesWithoutMidRequest): Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.post<StructureRangeGroupResponse>(`${this.endpoint}/RecalculateRangesWithoutMid`, request);
  }

  removeRange(request: RemoveRangeRequest): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}/RemoveRange`, request);
  }

  addJobsToRangeGroup(request: AddJobRangesRequest): Observable<CompanyStructureRange[]> {
    return this.payfactorsApiService.post<CompanyStructureRange[]>(`${this.endpoint}/AddJobRanges`, request);
  }

  addJobsFromSearchToRangeGroup(request: JobSearchRequestStructuresRangeGroup): Observable<CompanyStructureRange[]> {
    return this.payfactorsApiService.post<CompanyStructureRange[]>(`${this.endpoint}/AddAllJobRangesFromSearch`, request);
  }
}
