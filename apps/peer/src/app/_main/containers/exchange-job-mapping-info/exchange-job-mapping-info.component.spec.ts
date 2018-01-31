import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store, combineReducers, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingInfoComponent } from './exchange-job-mapping-info.component';
import { generateMockExchangeJobMapping } from '../../../../../../../libs/models/peer';

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
    instance.selectedExchangeJobMapping = generateMockExchangeJobMapping();

    fixture.detectChanges();

    // Find the close button in the template and trigger a click
    const closeButton = fixture.debugElement.query(By.css('.card-header .btn'));
    closeButton.triggerEventHandler('click', null);

    expect(instance.closeClicked.emit).toHaveBeenCalled();
  });

});
