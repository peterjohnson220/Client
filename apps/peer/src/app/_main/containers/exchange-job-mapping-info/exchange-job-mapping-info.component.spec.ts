import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import { ExchangeJobMapping, generateMockExchangeJobMapping } from 'libs/models/peer';

import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingInfoComponent } from './exchange-job-mapping-info.component';

describe('Peer - Exchange Job Mapping Info', () => {
  let fixture: ComponentFixture<ExchangeJobMappingInfoComponent>;
  let instance: ExchangeJobMappingInfoComponent;

  let store: Store<fromPeerMainReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeJobMappingInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ExchangeJobMappingInfoComponent);
    instance = fixture.componentInstance;
  });

  it('should emit a closeClicked event, when the close button is clicked', () => {
    // Spy on the emit method for the closeClicked EventEmitter
    spyOn(instance.closeClicked, 'emit');

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.card-header .btn'));
    closeButton.triggerEventHandler('click', null);

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });

  it('should show the exchange job mapping info', () => {
    const exchangeJobMapping: ExchangeJobMapping = generateMockExchangeJobMapping();
    instance.selectedExchangeJobMapping$ = of(exchangeJobMapping);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show dashes for all company job info except job description, when no information exists', () => {
    const exchangeJobMapping: ExchangeJobMapping = {
      ...generateMockExchangeJobMapping(),
      CompanyJobDescription: '',
      CompanyJobCode: '',
      CompanyJobFamily: '',
      CompanyJobLevel: '',
      CompanyJobTitle: ''
    };

    instance.selectedExchangeJobMapping$ = of(exchangeJobMapping);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


});
