import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AssociatedExchangeJobListComponent } from './associated-exchange-job-list.component';

describe('ExchangeJobComponent', () => {
  let component: AssociatedExchangeJobListComponent;
  let fixture: ComponentFixture<AssociatedExchangeJobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedExchangeJobListComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedExchangeJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
