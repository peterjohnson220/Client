import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {FilterService} from '@progress/kendo-angular-grid';

import { TicketListFilterComponent } from './ticket-list-filter.component';

describe('Admin - Tickets - Ticket List Filter', () => {
  let component: TicketListFilterComponent;
  let fixture: ComponentFixture<TicketListFilterComponent>;
  const queryStringParams = { 'company_name': 'PayFactors' };
  const length = 1;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [FilterService, {
        provide: ActivatedRoute ,
        useValue: { snapshot: { queryParamMap: { get: (key) =>  queryStringParams[key], keys: { length: length } } }
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event onChange', () => {
    spyOn(component.valueChange, 'emit');

    component.onChange(123);
    fixture.detectChanges();

    expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
  });
});
