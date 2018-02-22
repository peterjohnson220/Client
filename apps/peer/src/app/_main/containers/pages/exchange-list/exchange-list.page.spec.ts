import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ExchangeListItem, generateMockExchangeListItem } from 'libs/models/peer';
import { ExchangeListPageComponent } from './exchange-list.page';

describe('Peer - Exchange List Page', () => {
  let fixture: ComponentFixture<ExchangeListPageComponent>;
  let instance: ExchangeListPageComponent;
  let router: Router;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        ExchangeListPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    router = TestBed.get(Router);

    fixture = TestBed.createComponent(ExchangeListPageComponent);
    instance = fixture.componentInstance;
  });

  it('should tell the Router to navigate to the exchange passed to handleCellClick', () => {
    spyOn(router, 'navigate');

    const exchangeListItem: ExchangeListItem = generateMockExchangeListItem();

    instance.handleCellClick(exchangeListItem.ExchangeId);

    expect(router.navigate).toHaveBeenCalledWith(['exchange/job-mapping', exchangeListItem.ExchangeId]);
  });

});
