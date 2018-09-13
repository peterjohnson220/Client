import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { generateMockExchangeInvitation } from 'libs/models/peer';

import { CompanyExchangeInvitationInfoComponent } from './company-exchange-invitation-info.component';

describe('Company Exchange Invitation Info', () => {
  let fixture: ComponentFixture<CompanyExchangeInvitationInfoComponent>;
  let instance: CompanyExchangeInvitationInfoComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyExchangeInvitationInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CompanyExchangeInvitationInfoComponent);
    instance = fixture.componentInstance;

    instance.selectedCompanyInvitation = generateMockExchangeInvitation();
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
