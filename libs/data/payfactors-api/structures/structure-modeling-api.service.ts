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
  RemoveRangeRequest,
  OverrideAndSaveRangeFieldRequest,
  DuplicateModelResponse,
  DuplicateModelRequest,
  RevertRangeChangesRequest
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
    return this.payfactorsApiService.post<SaveModelSettingsResponse>(`${this.endpoint}/SaveModelSettings`, request);
  }

  recalculateRangeMinMax(request: RecalcAndSaveRangeMinMaxRequest): Observable<RecalcAndSaveRangeMinMaxResponse> {
    return this.payfactorsApiService.post<RecalcAndSaveRangeMinMaxResponse>(`${this.endpoint}/RecalculateRangeMinMax`, request);
  }

  overrideRangeField(request: OverrideAndSaveRangeFieldRequest): Observable<boolean> {
    return this.payfactorsApiService.post<boolean>(`${this.endpoint}/OverrideRangeField`, request);
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

  getOverriddenRangeIds(rangeGroupId: number): Observable<any> {
    return this.payfactorsApiService.get<number[]>(`${this.endpoint}/GetOverriddenRangeIds`, {
      params: { rangeGroupId }
    });
  }

  duplicateModel(request: DuplicateModelRequest): Observable<DuplicateModelResponse> {
    return this.payfactorsApiService.post<DuplicateModelResponse>(`${this.endpoint}/DuplicateModel`, request);
  }

  revertRangeChanges(request: RevertRangeChangesRequest): Observable<CompanyStructureRange> {
    return this.payfactorsApiService.post<CompanyStructureRange>(`${this.endpoint}/RevertRangeChanges`, request);
  }
}
