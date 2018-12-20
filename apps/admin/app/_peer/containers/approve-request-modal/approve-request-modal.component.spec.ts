import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ApproveRequestModalComponent } from './approve-request-modal.component';

describe ('Approve Request Modal', () => {
  let fixture: ComponentFixture<ApproveRequestModalComponent>;
  let instance: ApproveRequestModalComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ApproveRequestModalComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ApproveRequestModalComponent);
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

  it('should emit a approveClicked event, when the approve button is clicked', () => {
    // Spy on the emit method for the approveClicked EventEmitter
    spyOn(instance.approveClicked, 'emit');

    instance.reason.setValue('test');
    instance.peopleToNotify.setValue('NoOne');
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(instance.approveClicked.emit).toHaveBeenCalledWith({ reason: 'test', peopleToNotify: 'NoOne' });
  });
});
