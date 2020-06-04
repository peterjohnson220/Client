import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { PfModalFormComponent } from './pf-modal-form.component';
import spyOn = jest.spyOn;


describe('Pf Modal Form', () => {
  let fixture: ComponentFixture<PfModalFormComponent>;
  let instance: PfModalFormComponent;
  let formBuilder: FormBuilder;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        ReactiveFormsModule
      ],
      declarations: [
        PfModalFormComponent
      ],
    // Shallow Testing
     schemas: [ NO_ERRORS_SCHEMA ]
    });
    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(PfModalFormComponent);
    instance = fixture.componentInstance;
    instance.formGroup = formBuilder.group({
      'name': ['']
    });
    instance.modalId = 'test-modal';
    instance.title = 'Test';
    instance.primaryButtonText = 'Submit';
    instance.primaryButtonTextSubmitting = 'Submitting';
    instance.submitting = false;
    instance.isOpen$ = of(false);
  });

  it('should not have modal html when isOpen$ is false', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a onDismiss event, when dismiss is triggered', () => {
    // Spy on the emit method for the onDismiss EventEmitter
    spyOn(instance.onDismiss, 'emit');

    fixture.detectChanges();

    // trigger dismiss
    instance.dismiss();

    expect(instance.onDismiss.emit).toHaveBeenCalled();
  });

  it('should emit a onSubmit event, when submit is triggered', () => {
    // Spy on the emit method for the onSubmit EventEmitter
    spyOn(instance.onSubmit, 'emit');

    fixture.detectChanges();

    // trigger submit
    instance.submit();

    expect(instance.onSubmit.emit).toHaveBeenCalled();
  });

  it(`should show subTitle in modal header if a subTitle is provided`, () => {
    instance.subTitle = 'Mock subTitle';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  // TODO: Because we still haven't figured out how to render the modal content, this test is useless [JP]
  // it(`should not render the formContent template when no formGroup is provided`, () => {
  //   instance.formGroup = null;
  //
  //   fixture.detectChanges();
  //
  //   expect(fixture).toMatchSnapshot();
  // });

  // TODO: This doesn't work due to issue with NgbModal
  /*it('should have modal html when isOpen$ is true', async(() => {
    instance.isOpen$ = of(true);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  }));*/
  // TODO: This doesn't work due to issue with NgbModal
  /*it('should emit \'onDismiss\' event when cancel button is clicked', () => {
    // Spy on the emit method for the onDismiss EventEmitter
    spyOn(instance.onDismiss, 'emit');

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Find the cancel button in the template and trigger a click
      const cancelButton = fixture.debugElement.queryAll(By.css('.btn-secondary'))[0];
      cancelButton.triggerEventHandler('click', null);

      expect(instance.onDismiss.emit).toHaveBeenCalled();
    });
  });*/
  // TODO: This doesn't work due to issue with NgbModal
  /*it('should emit \'onDismiss\' event when dismiss button is clicked', () => {
    // Spy on the emit method for the onDismiss EventEmitter
    spyOn(instance.onDismiss, 'emit');

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Find the close button in the template and trigger a click
      const closeButton = fixture.debugElement.query(By.css('button.close'));
      closeButton.triggerEventHandler('click', null);

      expect(instance.onDismiss.emit).toHaveBeenCalled();
    });
  });*/
  // TODO: This doesn't work due to issue with NgbModal
  /*it('should emit \'onSubmit\' event when primary button is clicked', () => {
    // make the formGroup dirty so that the button can be clicked
    instance.formGroup.markAsDirty();

    // Spy on the emit method for the onSubmit EventEmitter
    spyOn(instance.onSubmit, 'emit');

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Find the submit button in the template and trigger a click
      const submitButton = fixture.debugElement.query(By.css('.btn-primary'));
      submitButton.triggerEventHandler('click', null);

      expect(instance.onSubmit.emit).toHaveBeenCalled();
    });
  });*/

//  TODO: Couldn't get this to work within a reasonable amount of time. Modal content and footers aren't displaying. (JP)
  /*it('should have disabled \'submit\' button when formGroup is invalid', () => {
    // set an error on the formGroup to make it invalid
    instance.formGroup.setErrors({'error': 'error'});

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });
  */
//  TODO: Couldn't get this to work within a reasonable amount of time. Modal content and footers aren't displaying. (JP)
  /*it('should have disabled \'submit\' button when submitting is true', () => {
    instance.submitting = true;

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });
*/
//  TODO: Couldn't get this to work within a reasonable amount of time. Modal content and footers aren't displaying. (JP)
/*
  it('should have enabled \'submit\' button when formGroup is valid and dirty', () => {
    instance.formGroup.markAsDirty();

    fixture.detectChanges();

    instance.isOpen$ = of(true);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });
*/

//  TODO: Couldn't get this to work within a reasonable amount of time. Modal content and footers aren't displaying. (JP)
/*  it('should transclude', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(hostComponent).toMatchSnapshot();
  });*/

});
