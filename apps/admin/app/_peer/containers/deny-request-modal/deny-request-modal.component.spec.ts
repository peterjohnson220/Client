import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DenyRequestModalComponent } from './deny-request-modal.component';

describe ('Deny Request Modal', () => {
  let fixture: ComponentFixture<DenyRequestModalComponent>;
  let instance: DenyRequestModalComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        DenyRequestModalComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(DenyRequestModalComponent);
    instance = fixture.componentInstance;
  });

  it('modal and text area should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a closeClicked event, when the handleModalDismissed method is called', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    instance.handleModalDismissed();

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });

  it('should emit a denyClicked event, when the deny button is clicked', () => {
    // Spy on the emit method for the denyClicked EventEmitter
    spyOn(instance.denyClicked, 'emit');

    instance.reason.setValue('test');
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(instance.denyClicked.emit).toHaveBeenCalledWith('test');
  });
});
