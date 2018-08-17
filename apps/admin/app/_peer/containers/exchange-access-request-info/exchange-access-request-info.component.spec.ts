import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { generateMockExchangeAccessRequest } from 'libs/models/peer';

import { ExchangeAccessRequestInfoComponent } from './exchange-access-request-info.component';

describe('Exchange Access Requests Info', () => {
  let fixture: ComponentFixture<ExchangeAccessRequestInfoComponent>;
  let instance: ExchangeAccessRequestInfoComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExchangeAccessRequestInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExchangeAccessRequestInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedAccessRequest = generateMockExchangeAccessRequest();
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
