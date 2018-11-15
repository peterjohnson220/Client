import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJobComponent } from './community-job.component';
import { generateMockCommunityJob } from 'libs/models';

describe('CommunityJobComponent', () => {
  let fixture: ComponentFixture<CommunityJobComponent>;
  let instance: CommunityJobComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunityJobComponent
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityJobComponent);
    instance = fixture.componentInstance;

    instance.job = generateMockCommunityJob();
  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
