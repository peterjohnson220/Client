import {PricingLoadersComponent} from '../pricing-loader';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {provideMockStore} from '@ngrx/store/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';


describe('PricingLoadersComponent', () => {
  let instance: PricingLoadersComponent;
  let fixture: ComponentFixture<PricingLoadersComponent>;
  let store: Store<fromCompanyReducer.State>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [PricingLoadersComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PricingLoadersComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
