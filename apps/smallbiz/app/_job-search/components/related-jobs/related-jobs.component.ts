import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { Job } from '../../models/job';

@Component({
  selector: 'pf-related-jobs',
  templateUrl: './related-jobs.component.html',
  styleUrls: ['./related-jobs.component.scss']
})
export class RelatedJobsComponent implements OnInit {

  @Input() relatedJobs$: Observable<Job[]>;
  @Input() job$: Observable<Job>;

  @Output() relatedJobClicked = new EventEmitter<Job>();

  constructor() { }

  ngOnInit() { }

  onRelatedJobClick(relatedJob: Job, $event: MouseEvent) {
    // don't emit an event on ctrl click/open in new tab so the current tab stays unchanged
    if (!$event.ctrlKey) {
      this.relatedJobClicked.emit(relatedJob);
    }
  }
}
