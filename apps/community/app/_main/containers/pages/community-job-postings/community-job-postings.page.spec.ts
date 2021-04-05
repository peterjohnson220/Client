import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommunityJobPostingsPageComponent } from './community-job-postings.page';

describe('CommunityJobPostingsPageComponent', () => {
  let fixture: ComponentFixture<CommunityJobPostingsPageComponent>;
  let instance: CommunityJobPostingsPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CommunityJobPostingsPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityJobPostingsPageComponent);
    instance = fixture.componentInstance;
  }));

  it('should show community job postings page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
