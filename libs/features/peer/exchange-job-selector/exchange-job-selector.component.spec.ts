import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

import {ExchangeJobSelectorComponent} from './exchange-job-selector.component';
import {generateMockExchangeJobExchangeDetail} from '../models';
import {StatusEnum} from '../../../models/common';

describe('Features - Peer - Exchange Job Selector Component', () => {
  let fixture: ComponentFixture<ExchangeJobSelectorComponent>;
  let instance: ExchangeJobSelectorComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule
      ],
      declarations: [
        ExchangeJobSelectorComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExchangeJobSelectorComponent);
    instance = fixture.componentInstance;

    const mockExchangeJobExchangeDetail = generateMockExchangeJobExchangeDetail();

    instance.selectedExchangeJobId = mockExchangeJobExchangeDetail.ExchangeJobId;
    instance.shouldDisplayJobTitleShort = false;
    instance.exchangeJobSelectorItems = [
      mockExchangeJobExchangeDetail,
      {
        ...mockExchangeJobExchangeDetail,
        ExchangeJobId: 1,
        ExchangeId: 1,
        ExchangeJobTitleShort: mockExchangeJobExchangeDetail.ExchangeJobTitleShort + '1',
        ExchangeStatus: StatusEnum.Inactive
      },
      {...mockExchangeJobExchangeDetail, ExchangeJobId: 2, ExchangeId: 2, ExchangeJobTitleShort: mockExchangeJobExchangeDetail.ExchangeJobTitleShort + '2'}
    ];
  });

  it('should emit an exchangeJobSelected event when clicking on a job', () => {
    const event = new MouseEvent('click');

    fixture.detectChanges();

    const mockExchangeJobExchangeDetail = generateMockExchangeJobExchangeDetail();
    const expectedPayload = {
      exchangeJobId: mockExchangeJobExchangeDetail.ExchangeJobId,
      similarExchangeJobIds: mockExchangeJobExchangeDetail.SimilarExchangeJobIds
    };

    spyOn(instance.exchangeJobSelected, 'emit');

    instance.handleExchangeJobClicked(event, mockExchangeJobExchangeDetail);

    expect(instance.exchangeJobSelected.emit).toHaveBeenCalledWith(expectedPayload);
  });

  it('should display the currently selected exchange job', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display exchange as INACTIVE when the exchange is inactive', () => {
    instance.selectedExchangeJobId = 1;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should disable exchange job selector button when there is only one exchange job`, () => {
    instance.exchangeJobSelectorItems = [generateMockExchangeJobExchangeDetail()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should display job title short if shouldDisplayJobTitleShort is true`, () => {
    instance.shouldDisplayJobTitleShort = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

  });
});
