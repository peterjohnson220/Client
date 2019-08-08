import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StandardReportsListComponent } from './standard-reports-list.component';
import { generateMockStandardReportDetails } from '../../models';

describe('Data Insights Management - Standard Reports List Component', () => {
  let instance: StandardReportsListComponent;
  let fixture: ComponentFixture<StandardReportsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardReportsListComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(StandardReportsListComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit editClicked when clicking on Edit button with correct report', () => {
    const selectedItem = generateMockStandardReportDetails();
    instance.standardReportsList = [selectedItem];
    spyOn(instance.editClicked, 'emit');

    instance.handleEditClicked(selectedItem);

    expect(instance.editClicked.emit).toHaveBeenCalledWith(selectedItem);
  });
});
