import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { TermsConditionsModalComponent } from './terms-conditions-modal.component';
import spyOn = jest.spyOn;


describe('Pf Modal Form', () => {
  let fixture: ComponentFixture<TermsConditionsModalComponent>;
  let instance: TermsConditionsModalComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        ReactiveFormsModule
      ],
      declarations: [
        TermsConditionsModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TermsConditionsModalComponent);
    instance = fixture.componentInstance;
    instance.title = 'Test';
    instance.isOpen$ = of(false);
  });

  it('should not have modal html when isOpen$ is false', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit an onAccept event, when acceptTermsAndConditions is triggered', () => {
    // Spy on the emit method for the onDismiss EventEmitter
    spyOn(instance.onAccept, 'emit');

    fixture.detectChanges();

    // trigger dismiss
    instance.acceptTermsAndConditions();

    expect(instance.onAccept.emit).toHaveBeenCalled();
  });

  it('should emit a onDecline event, when declineTermsAndConditions is triggered', () => {
    // Spy on the emit method for the onSubmit EventEmitter
    spyOn(instance.onDecline, 'emit');

    fixture.detectChanges();

    // trigger submit
    instance.declineTermsAndConditions();

    expect(instance.onDecline.emit).toHaveBeenCalled();
  });


});
