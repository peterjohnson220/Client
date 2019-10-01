import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JobDescription } from 'libs/models/jdm';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

@Injectable()
export class JobDescriptionJobCompareService {
  constructor(private jobDescriptionApiService: JobDescriptionApiService) {}

  saveJobDescription(jobDescription: JobDescription, isFirstSave: boolean): Observable<JobDescription> {
    return this.jobDescriptionApiService.save(jobDescription, isFirstSave);
  }
}
