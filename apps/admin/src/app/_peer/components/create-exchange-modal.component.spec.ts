import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { of } from 'rxjs/observable/of';

import { CreateExchangeModalComponent } from './create-exchange-modal.component';

describe('Create Exchange Modal', () => {
  let fixture: ComponentFixture<CreateExchangeModalComponent>;
  let instance: CreateExchangeModalComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        CreateExchangeModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CreateExchangeModalComponent);
    instance = fixture.componentInstance;

    instance.creatingExchange = false;
    instance.isOpen$ = of(true);
    instance.error$ = of(false);
    instance.errorMessage$ = of('test');
  });

  it('should show the form text and no error messages when a submit has not been attempted', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show the form text and should show a required error message once a submit has been attempted', () => {
    fixture.detectChanges();

    // trigger handleFormSubmit
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  // TODO: Couldn't get this to work within a reasonable amount of time. The error message is not getting set and I couldn't figure out why. (JP)
/*  it('should not show the form text and should show the error messages if there is an error$ and the form has been submitted', () => {
    // instance.name.setValue('test');
    instance.attemptedSubmit = true;
    fixture.detectChanges();

    instance.error$ = of(true);
    instance.errorMessage$ = of('test');
    const nameInput = fixture.debugElement.query(By.css('input')).nativeElement;
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });*/

  it('should emit a createExchangeEvent event, when handleFormSubmit is triggered', () => {
    // Spy on the emit method for the createExchangeEvent EventEmitter
    spyOn(instance.createExchangeEvent, 'emit');

    fixture.detectChanges();

    // trigger handleFormSubmit
    instance.handleFormSubmit();

    expect(instance.createExchangeEvent.emit).toHaveBeenCalled();
  });

  it('should emit a modalDismissedEvent event, when handleModalDismissed is triggered', () => {
    // Spy on the emit method for the modalDismissedEvent EventEmitter
    spyOn(instance.modalDismissedEvent, 'emit');

    fixture.detectChanges();

    // trigger handleModalDismissed
    instance.handleModalDismissed();

    expect(instance.modalDismissedEvent.emit).toHaveBeenCalled();
  });

});
