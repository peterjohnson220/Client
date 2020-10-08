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

  getJobLevelsForJobFamilies(jobFamilies: string[]): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobLevelsForJobFamily`, jobFamilies);
  }

  createJobLevelHierarchy(jobLevelHierarchy: JobLevelHierarchyDetail): Observable<JobLevelHierarchyDetail> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateJobLevelHierarchy`, jobLevelHierarchy);
  }

  getJobLevelHierachies(): Observable<JobLevelHierarchy[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetJobLevelHierarchies`);
  }

  getJobLevelHierachy(hierarchyId: number): Observable<JobLevelHierarchyDetail> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetJobLevelHierarchy`, { params: { hierarchyId: hierarchyId } });
  }
}
