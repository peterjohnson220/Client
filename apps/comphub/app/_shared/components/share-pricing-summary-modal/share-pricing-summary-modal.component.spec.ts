import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharePricingSummaryModalComponent } from './share-pricing-summary-modal.component';

describe('Comphub - Main - Share Pricing Summary Modal Component', () => {
  let instance: SharePricingSummaryModalComponent;
  let fixture: ComponentFixture<SharePricingSummaryModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePricingSummaryModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SharePricingSummaryModalComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit sendClick with the correct email address when send button clicked', () => {
    spyOn(instance.sendClick, 'emit');
    const expectedEmailAddress = 'test@payfactors.com';
    instance.sharePricingSummaryForm.patchValue({
      emailAddress: expectedEmailAddress
    });

    instance.handleSendClicked();

    expect(instance.sendClick.emit).toHaveBeenCalledWith({
      emailAddress: expectedEmailAddress,
      note: ''
    });
  });

  it('should emit sendClick with the correct email address and note when send button clicked', () => {
    spyOn(instance.sendClick, 'emit');
    const expectedEmailAddress = 'test@payfactors.com';
    const expectedNote = 'Adding note test';
    instance.sharePricingSummaryForm.patchValue({
      emailAddress: expectedEmailAddress,
      note: expectedNote
    });

    instance.handleSendClicked();

    expect(instance.sendClick.emit).toHaveBeenCalledWith({
      emailAddress: expectedEmailAddress,
      note: expectedNote
    });
  });

  it('should emit cancelClick when cancel button clicked', () => {
    spyOn(instance.cancelClick, 'emit');

    instance.handleCancelClicked();

    expect(instance.cancelClick.emit).toHaveBeenCalled();
  });

});
