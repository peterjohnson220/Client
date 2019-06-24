import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobDescriptionParserPipe } from 'libs/core/pipes';
import { generateMockExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import { ExchangeDetailComponent } from './exchange-job-detail.component';

describe('ExchangeDetailComponent', () => {
  let component: ExchangeDetailComponent;
  let fixture: ComponentFixture<ExchangeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeDetailComponent, JobDescriptionParserPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the selected exchange jobs props', () => {
    component.exchangeJob = generateMockExchangeJob();
    component.exchangeJob.ExchangeJobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
