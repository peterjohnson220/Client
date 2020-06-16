import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {provideMockStore} from '@ngrx/store/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import {PricingLoaderDownloadComponent} from './pricing-loader-download';


describe('PricingLoaderDownloadComponent', () => {
  let instance: PricingLoaderDownloadComponent;
  let fixture: ComponentFixture<PricingLoaderDownloadComponent>;
  let store: Store<fromPfDataGridReducer.State>;
  const queryStringParams = { 'company': '1-PayFactors' };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [PricingLoaderDownloadComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore({}), {
        provide: ActivatedRoute ,
        useValue: { snapshot: { queryParamMap: { get: (key) =>  queryStringParams[key], keys: { length: length } } }
        }
      }],
    });


    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PricingLoaderDownloadComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
