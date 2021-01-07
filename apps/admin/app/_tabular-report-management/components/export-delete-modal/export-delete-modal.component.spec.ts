import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDeleteModalComponent } from './export-delete-modal.component';

describe('ExportDeleteModalComponent', () => {
  let instance: ExportDeleteModalComponent;
  let fixture: ComponentFixture<ExportDeleteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDeleteModalComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ExportDeleteModalComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit a cancelClicked event, when the onDismiss method is called', () => {
    spyOn(instance.cancelClicked, 'emit');

    instance.onDismiss();

    expect(instance.cancelClicked.emit).toHaveBeenCalled();
  });

  it('should emit a deleteScheduledExport event, when the onSubmit method is called', () => {
    spyOn(instance.deleteScheduledExport, 'emit');

    instance.onSubmit();

    expect(instance.deleteScheduledExport.emit).toHaveBeenCalled();
  });
});
