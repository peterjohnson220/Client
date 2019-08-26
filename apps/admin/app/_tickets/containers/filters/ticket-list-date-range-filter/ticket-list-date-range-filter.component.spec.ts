import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { FilterService } from '@progress/kendo-angular-grid';

import { TicketListDateRangeFilterComponent } from './ticket-list-date-range-filter.component';
import { TicketFieldType } from '../../../constants/tickets-constants';

describe('Admin - Tickets - Ticket Value Picker', () => {
  let instance: TicketListDateRangeFilterComponent;
  let fixture: ComponentFixture<TicketListDateRangeFilterComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListDateRangeFilterComponent, NgModel ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [FilterService],
      imports: [
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketListDateRangeFilterComponent);
    instance = fixture.componentInstance;

    instance.defaultValue = { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() };
    instance.filterField = TicketFieldType.CREATED;

    fixture.detectChanges();
  }));

  it('should emit an event on updateDateRange', () => {
    spyOn(instance.valueChange, 'emit');
    instance.toDateInput = {} as NgModel;
    instance.fromDateInput = {} as NgModel;

    instance.updateDateRange();
    fixture.detectChanges();

    expect(instance.valueChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit an event on clearValue when valid range', () => {
    spyOn(instance.valueChange, 'emit');

    instance.toDateInput = {} as NgModel;
    instance.fromDateInput = {} as NgModel;

    instance.clearValue();
    fixture.detectChanges();

    expect(instance.valueChange.emit).toHaveBeenCalledTimes(1);
  });
});
