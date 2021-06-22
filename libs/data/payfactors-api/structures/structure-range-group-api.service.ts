import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  StructureRangeGroupGradesResponse,
  StructureRangeGroupResponse,
  StructureRangeGroupGradeJobsResponse,
  RangeDistributionType
} from 'libs/models/payfactors-api/structures';
import { CompanyStructureInfo, StructureForm } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class StructureRangeGroupApiService {
  private readonly endpoint = 'StructureRangeGroup';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyStructureRangeGroup(companyStructureRangeGroupId: number): Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.get<StructureRangeGroupResponse>(`${this.endpoint}(${companyStructureRangeGroupId})`);
  }

  addJobStructureMapping(companyJobId: number, structures: CompanyStructureInfo[]): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/Default.AddJobStructureMapping`,
      {CompanyJobId: companyJobId, StructureData: structures});
  }

  publishStructureModel(companyStructureRangeGroupId: number): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}(${companyStructureRangeGroupId})/Default.Publish`);
  }

  deleteStructureModel(companyStructureRangeGroupId): Observable<any> {
    return this.payfactorsApiService.delete<any>(`${this.endpoint}(${companyStructureRangeGroupId})`);
  }

  getDetails(companyStructureRangeGroupId: number): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}(${companyStructureRangeGroupId})/Default.GetDetail`);
  }

  getGrades(companyStructureRangeGroupId: number, intercept: number, slope: number, roundDecimals: number): Observable<StructureRangeGroupGradesResponse[]> {
    return this.payfactorsApiService.get<StructureRangeGroupGradesResponse[]>(`${this.endpoint}(${companyStructureRangeGroupId})/Default.GetGrades`,
      {params: {intercept: intercept, slope: slope, roundDec: roundDecimals }});
  }

  getJobsAvailableToAdd(companyStructureRangeGroupId: number, companyStructuresGradesId: number): Observable<StructureRangeGroupGradeJobsResponse[]> {
    return this.payfactorsApiService.get<StructureRangeGroupGradeJobsResponse[]>(
      `${this.endpoint}(${companyStructureRangeGroupId})/Default.GetJobsAvailableToAdd`,
      {params: {gradeId: companyStructuresGradesId }});
  }

  getJobs(companyStructureRangeGroupId: number, companyStructuresGradesId: number): Observable<StructureRangeGroupGradeJobsResponse[]> {
    return this.payfactorsApiService.get<StructureRangeGroupGradeJobsResponse[]>(
      `${this.endpoint}(${companyStructureRangeGroupId})/Default.GetJobs`,
      {params: {gradeId: companyStructuresGradesId }});
  }

  addJobsToGrade(companyStructureRangeGroupId: number, addJobsParams: any): Observable<any> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}(${companyStructureRangeGroupId})/Default.AddJobs`, addJobsParams);
  }

  getRangeDistributionTypes(): Observable<RangeDistributionType[]> {
    return this.payfactorsApiService.get<RangeDistributionType[]>(`${this.endpoint}/Default.GetRangeDistributionTypes`);
  }

  createRangeGroup(structureForm: StructureForm): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/Default.InsertRangeGroup`, structureForm);
  }

}
