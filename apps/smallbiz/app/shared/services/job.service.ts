import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../../shared/models/job';
import { JobTitle } from '../../shared/models/jobTitle';

@Injectable({
  providedIn: 'root'
})

export class JobService {
  // TODO - remove this when we have real http requests
  mockJobs = [
    {
      id: '1',
      title: 'zookeeper',
      description: 'Responsible for the wellbeing of the animals living in zoos. The job requires a keeper to routinely complete a ' +
        'number of tasks for the animals, such as bathing, feeding and exercising.',
      nationalBase25: 70000,
      nationalBase50: 80000,
      nationalBase75: 90000,
      nationalTcc25: 75000,
      nationalTcc50: 85000,
      nationalTcc75: 88000,
    } as Job,
    {
      id: '2',
      title: 'lion trainer',
      description: 'Train animals for riding, harness, security, performance, or obedience, or assisting persons with disabilities. ' +
        'Accustom animals to human voice and contact; and condition animals to respond to commands. ',
      nationalBase25: 80000,
      nationalBase50: 90000,
      nationalBase75: 100000,
      nationalTcc25: 85000,
      nationalTcc50: 95000,
      nationalTcc75: 110000,
    } as Job,
    {
      id: '3',
      title: 'clerk',
      description: 'Maintain files and records so they remain updated and easily accessible. Sort and distribute incoming mail and ' +
        'prepare outgoing mail (envelopes, packages, etc.) Answer the phone to take messages or redirect calls to appropriate colleagues',
      nationalBase25: 55000,
      nationalBase50: 65000,
      nationalBase75: 78000,
      nationalTcc25: 62000,
      nationalTcc50: 72000,
      nationalTcc75: 88000,
    } as Job,
  ];

  constructor() { }

  search(searchTerm = ''): Observable<JobTitle[]> {
    // TODO - real http request
    return of(this.mockJobs);
  }

  getJob(id: string): Observable<Job> {
    // TODO - real http request
    return of(this.mockJobs.find(j => j.id === id));
  }
}
