import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IntlService, CldrIntlService  } from '@progress/kendo-angular-intl';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';

import { DateRangeFilterComponent } from './date-range-filter.component';

describe('Data Insights - Date Range Filter Component', () => {
  let instance: DateRangeFilterComponent;
  let fixture: ComponentFixture<DateRangeFilterComponent>;
  let intlService: IntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ { provide: IntlService, useClass: CldrIntlService } ]
    });

    fixture = TestBed.createComponent(DateRangeFilterComponent);
    instance = fixture.componentInstance;
    intlService = TestBed.get(IntlService);

    fixture.detectChanges();
  });

  it('should return correct selectionRange when providing valid startDate and endDate', () => {
    instance.startDate = '2019-09-27';
    instance.endDate = '2019-09-28';

    expect(instance.selectionRange.start.getDate()).toEqual(27);
    expect(instance.selectionRange.end.getDate()).toEqual(28);
  });

  it('should return null when no startDate and endDate provided', () => {
    expect(instance.selectionRange.start).toEqual(null);
    expect(instance.selectionRange.end).toEqual(null);
  });

  it('should enforce date range to be one date apart when selecting same start and end date', () => {
    spyOn(instance.selectionRangeChanged, 'emit');
    const range: SelectionRange = {
      start: new Date('2019-09-27'),
      end: new Date('2019-09-27')
    };
    const expectedRange: SelectionRange = {
      start: new Date('2019-09-27'),
      end: new Date('2019-09-28')
    };

    instance.handleSelectionRangeChange(range);

    expect(instance.selectionRangeChanged.emit).toHaveBeenCalledWith(expectedRange);
  });
});
