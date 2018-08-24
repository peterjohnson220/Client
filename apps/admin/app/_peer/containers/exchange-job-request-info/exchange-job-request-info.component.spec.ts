import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { generateMockExchangeJobRequest } from 'libs/models/peer';

import { ExchangeJobRequestInfoComponent } from './exchange-job-request-info.component';

describe('Exchange Job Request Info', () => {
  let fixture: ComponentFixture<ExchangeJobRequestInfoComponent>;
  let instance: ExchangeJobRequestInfoComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExchangeJobRequestInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExchangeJobRequestInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedJobRequest = generateMockExchangeJobRequest();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a closeClicked event, when the close button is clicked', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.close-btn'));
    closeButton.triggerEventHandler('click', null);

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });
});
