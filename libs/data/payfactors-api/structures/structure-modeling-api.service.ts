import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  SaveModelSettingsRequest,
  SaveModelSettingsResponse,
  RecalcAndSaveRangeMinMaxRequest,
  RecalcAndSaveRangeMinMaxResponse,
  StructureRangeGroupResponse,
  AddJobRangesRequest,
  JobSearchRequestStructuresRangeGroup
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

  recalculateRangesWithoutMid(rangeGroupId: number): Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.get<StructureRangeGroupResponse>(`${this.endpoint}/RecalculateRangesWithoutMid`, {
      params: { rangeGroupId }
    } );
  }

  addJobsToRangeGroup(request: AddJobRangesRequest): Observable<CompanyStructureRange[]> {
    return this.payfactorsApiService.post<CompanyStructureRange[]>(`${this.endpoint}/AddJobRanges`, request);
  }

  addJobsFromSearchToRangeGroup(request: JobSearchRequestStructuresRangeGroup): Observable<CompanyStructureRange[]> {
    return this.payfactorsApiService.post<CompanyStructureRange[]>(`${this.endpoint}/AddAllJobRangesFromSearch`, request);
  }
}
