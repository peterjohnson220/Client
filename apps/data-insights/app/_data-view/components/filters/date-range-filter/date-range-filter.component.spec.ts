import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IntlService, CldrIntlService  } from '@progress/kendo-angular-intl';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';

import { DateRangeFilterComponent } from './date-range-filter.component';
import { IsBefore, Between } from '../../../models';

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
    spyOn(instance.selectedOptionsChanged, 'emit');
    const range: SelectionRange = {
      start: new Date('2019-09-27'),
      end: new Date('2019-09-27')
    };
    const expectedRange: string[] = ['2019-09-27', '2019-09-28'];

    instance.handleSelectionRangeChange(range);

    expect(instance.selectedOptionsChanged.emit).toHaveBeenCalledWith(expectedRange);
  });

  it('should emit selectedOptionsChanged with correct date when handling datepicker value changed', () => {
    spyOn(instance.selectedOptionsChanged, 'emit');
    const selectedDate: Date = new Date('2019-10-01');

    instance.handleValueChanged(selectedDate);

    expect(instance.selectedOptionsChanged.emit).toHaveBeenCalledWith(['2019-10-01']);
  });

  it('should dispatch selectedOperatorChanged with correct operator when handling operator selection changed', () => {
    spyOn(instance.selectedOperatorChanged, 'emit');
    const selectedOperator = IsBefore;

    instance.handleOperatorSelectionChanged(selectedOperator);

    expect(instance.selectedOperatorChanged.emit).toHaveBeenCalledWith(selectedOperator);
  });

  it('should emit selectedOptionsChanged with startDate when toggling from date range to single date', () => {
    spyOn(instance.selectedOptionsChanged, 'emit');
    instance.selectedOperator = Between;
    instance.startDate = '2019-09-27';
    instance.endDate = '2019-09-28';
    const currentOperator = IsBefore;

    fixture.detectChanges();
    instance.handleOperatorSelectionChanged(currentOperator);

    expect(instance.selectedOptionsChanged.emit).toHaveBeenCalledWith(['2019-09-27']);
  });

  it('should NOT emit selectedOptionsChanged with startDate when toggling from date to date range', () => {
    spyOn(instance.selectedOptionsChanged, 'emit');
    instance.selectedOperator = IsBefore;
    instance.startDate = '2019-09-27';
    const currentOperator = IsBefore;

    fixture.detectChanges();
    instance.handleOperatorSelectionChanged(currentOperator);

    expect(instance.selectedOptionsChanged.emit).not.toHaveBeenCalledWith(['2019-09-27']);
  });
});
