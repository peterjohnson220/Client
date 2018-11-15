import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, DecimalPipe } from '@angular/common';

import { of } from 'rxjs';

import { RelatedJobsComponent } from './related-jobs.component';
import * as fromJob from '../../models/job';

describe('RelatedJobsComponent', () => {
  let component: RelatedJobsComponent;
  let fixture: ComponentFixture<RelatedJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelatedJobsComponent],
      imports: [RouterModule.forRoot([])],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedJobsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should match snapshot on init', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show the job family in the header', () => {
    const job = fromJob.createMockJob();
    component.job$ = of(job);

    fixture.detectChanges();

    const headerText = fixture.nativeElement.querySelector('h5').innerHTML;
    expect(headerText).toContain(job.family);
  });

  it('should show an empty table body if there are no related jobs', () => {
    component.relatedJobs$ = of([] as fromJob.Job[]);

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelector('table tbody tr');
    expect(tableRows).toBeNull();
  });

  it('should show a table row for each related job', () => {
    const job1 = fromJob.createMockJob();
    const job2 = fromJob.createMockJob(2, 'Lion Tamer', 'Tames lions', 'ABC', 'Zoo');
    const job3 = fromJob.createMockJob(3, 'Janitor', 'Cleans up', 'DEF', 'Zoo');
    const relatedJobs = [job1, job2, job3];
    component.relatedJobs$ = of(relatedJobs);

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('table tbody tr');
    expect(tableRows.length).toEqual(relatedJobs.length);
  });

  it('should show each field in the expected column', () => {
    const job = fromJob.createMockJob();
    const relatedJobs = [job];
    component.relatedJobs$ = of(relatedJobs);

    fixture.detectChanges();

    const tableData = fixture.nativeElement.querySelectorAll('table tbody tr td');
    expect(tableData[0].innerHTML).toContain(job.title);
    expect(tableData[1].innerHTML).toContain(job.description);
    expect(tableData[2].innerHTML).toContain(new DecimalPipe('en').transform(job.nationalBase25, '1.0-0'));
    expect(tableData[3].innerHTML).toContain(new DecimalPipe('en').transform(job.nationalBase75, '1.0-0'));
  });

  it('should show an anchor tag with the expected properties in the table', () => {
    const job = fromJob.createMockJob();
    const relatedJobs = [job];
    component.relatedJobs$ = of(relatedJobs);

    fixture.detectChanges();

    const tableData = fixture.nativeElement.querySelectorAll('table tbody tr td');
    expect(tableData[0].innerHTML).toContain(`job/${job.id}`);
  });

  it('should emit the expected event when a related job is clicked', () => {
    const job = fromJob.createMockJob();
    const relatedJobs = [job];
    component.relatedJobs$ = of(relatedJobs);

    spyOn(component.relatedJobClicked, 'emit');
    component.onRelatedJobClick(job, new MouseEvent('click'));

    expect(component.relatedJobClicked.emit).toHaveBeenCalled();
  });

  it('should not emit an event when a related job is ctl clicked', () => {
    const job = fromJob.createMockJob();
    const relatedJobs = [job];
    component.relatedJobs$ = of(relatedJobs);

    spyOn(component.relatedJobClicked, 'emit');
    const ctlClick = { ctrlKey: true };
    component.onRelatedJobClick(job, ctlClick as MouseEvent);

    expect(component.relatedJobClicked.emit).not.toHaveBeenCalled();
  });
});
