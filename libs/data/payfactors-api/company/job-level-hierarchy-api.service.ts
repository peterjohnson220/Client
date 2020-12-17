import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JobLevelHierarchyDetail, JobLevelHierarchy } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobLevelHierarchyApiService {
  private endpoint = 'JobLevelHierarchy';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getAvailableJobLevels(hierarchyId: number, selectedJobFamilies?: string[]): Observable<string[]> {
    if (!!selectedJobFamilies && selectedJobFamilies.length > 0) {
      return this.getJobLevelsForJobFamilies(selectedJobFamilies);
    } else {
      return this.payfactorsApiService.get(`${this.endpoint}/GetAvailableJobLevels`);
    }
  }

  getAvailableJobFamiliesForHierarchy(hierarchyId: number): Observable<string[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetAvailableJobFamilies?hierarchyId=${hierarchyId}`);
  }

  getAvailableJobFamilies(): Observable<string[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetAvailableJobFamilies`);
  }

  getJobLevelsForJobFamilies(jobFamilies: string[]): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobLevelsForJobFamily`, jobFamilies);
  }

  createJobLevelHierarchy(jobLevelHierarchy: JobLevelHierarchyDetail): Observable<JobLevelHierarchyDetail> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateJobLevelHierarchy`, jobLevelHierarchy);
  }

  getJobLevelHierachies(): Observable<JobLevelHierarchy[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetJobLevelHierarchies`);
  }

  getJobLevelHierarchy(hierarchyId: number): Observable<JobLevelHierarchyDetail> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetJobLevelHierarchy`, { params: { hierarchyId: hierarchyId } });
  }

  deleteJobLevelHierarchy(hierarchyId: number): Observable<boolean> {
    return this.payfactorsApiService.delete(`${this.endpoint}/DeleteJobLevelHierarchy?hierarchyId=${hierarchyId}`);
  }
}
