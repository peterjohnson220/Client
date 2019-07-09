import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobDescriptionParserPipe } from 'libs/core/pipes';
import { generateMockExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { generateMockCompanyJob } from 'libs/features/peer/job-association/models/company-job.model';

import { ExchangeDetailComponent } from './exchange-job-detail.component';

describe('ExchangeDetailComponent', () => {
  let component: ExchangeDetailComponent;
  let fixture: ComponentFixture<ExchangeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeDetailComponent, JobDescriptionParserPipe],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeDetailComponent);
    component = fixture.componentInstance;

    component.selectedCompanyJob = {} as any;
    component.exchangeJob = {} as any;
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

  it('should show the approve/reject buttons when a company job with a pending match is selected', () => {
    component.selectedCompanyJob = { ...generateMockCompanyJob(), IsPendingPeerUserReview: true };
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should hide the approve/reject buttons when a company job with a pending match is selected', () => {
    component.selectedCompanyJob = { ...generateMockCompanyJob(), IsPendingPeerUserReview: false };
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should emit when approve is clicked', () => {
    spyOn(component.approveClick, 'emit');
    component.selectedCompanyJob = { ...generateMockCompanyJob(), IsPendingPeerUserReview: true };

    fixture.detectChanges();
    const approveButton = fixture.debugElement.nativeElement.querySelector('button.approve');
    approveButton.click();

    expect(component.approveClick.emit).toHaveBeenCalled();
  });

  it('should emit when reject is clicked', () => {
    spyOn(component.rejectClick, 'emit');
    component.selectedCompanyJob = { ...generateMockCompanyJob(), IsPendingPeerUserReview: true };

    fixture.detectChanges();
    const rejectButton = fixture.debugElement.nativeElement.querySelector('button.reject');
    rejectButton.click();

    expect(component.rejectClick.emit).toHaveBeenCalled();
  });

});
