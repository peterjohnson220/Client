import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobDescriptionWorkflowPanelComponent } from './job-description-workflow-panel.component';

describe('JobDescriptionWorkflowPanelComponent', () => {
  let component: JobDescriptionWorkflowPanelComponent;
  let fixture: ComponentFixture<JobDescriptionWorkflowPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDescriptionWorkflowPanelComponent ],
      imports: [
        NgbModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionWorkflowPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
