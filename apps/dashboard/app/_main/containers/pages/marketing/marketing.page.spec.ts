import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockUserContext } from 'libs/models/security';

import { MarketingPageComponent } from './marketing.page';
import * as fromMarketingReducer from '../../../reducers';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


describe('MarketingPage', () => {
  let component: MarketingPageComponent;
  let fixture: ComponentFixture<MarketingPageComponent>;
  let store: Store<fromMarketingReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          marketing: combineReducers(fromMarketingReducer.reducers),
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { routeConfig: { path : 'pricing-projects' } } } }
        }
      ],
      declarations: [ MarketingPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MarketingPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build iframe source url after identity$ is emitted', () => {
    spyOn(component, 'buildSourceUrl');
    component.identity$ = of(generateMockUserContext());
    component.ngOnInit();

    expect(component.buildSourceUrl).toHaveBeenCalled();
  });

  it('should transform kebab casing to title casing when transformToTitleCase is called', () => {
    let value = component.transformToTitleCase('pay-markets');
    expect(value).toEqual('Pay Markets');

    value = component.transformToTitleCase('peer');
    expect(value).toEqual('Peer');
  });
});
