import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { getMockRelationalExchangeJobResult, RelationalExchangeJobResult } from 'libs/models';

import { RelationalExchangeJobResultComponent } from './relational-exchange-job-result.component';


describe('Libs - Peer - RelationalExchangeJobSearch - RelationalExchangeJobResultComponent', () => {
  let component: RelationalExchangeJobResultComponent;
  let fixture: ComponentFixture<RelationalExchangeJobResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationalExchangeJobResultComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalExchangeJobResultComponent);
    component = fixture.componentInstance;
    component.exchangeJob = {} as RelationalExchangeJobResult;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display exchange job info when available', () => {
    // arrange
    component.exchangeJob = getMockRelationalExchangeJobResult();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });
});
