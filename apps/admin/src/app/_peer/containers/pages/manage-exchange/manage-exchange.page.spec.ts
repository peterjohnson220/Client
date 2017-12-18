import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { generateMockExchange } from 'libs/models/peer';

import { ManageExchangePageComponent } from './manage-exchange.page';

describe('Exchange List Page', () => {
  let fixture: ComponentFixture<ManageExchangePageComponent>;
  let instance: ManageExchangePageComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManageExchangePageComponent
      ],
      providers: [
        { provide: Store, useValue:  { select: jest.fn() } }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ManageExchangePageComponent);
    instance = fixture.componentInstance;
  });

  it('should pass the exchange name to the page title transclusion area', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
