import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymarketCardsComponent } from './paymarket-cards.component';
import { generateMockPricingPaymarket } from '../../models';

describe('Comphub - Main - Paymarket Cards', () => {
  let instance: PaymarketCardsComponent;
  let fixture: ComponentFixture<PaymarketCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymarketCardsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PaymarketCardsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit a paymarketChecked event when paymarket toggled', () => {
    spyOn(instance.paymarketChecked, 'emit');

    instance.togglePaymarket(generateMockPricingPaymarket());

    expect(instance.paymarketChecked.emit).toHaveBeenCalled();
  });

  it('should track by the company pay market id', () => {
    const pricingPayMarket = generateMockPricingPaymarket();
    expect(instance.trackById(1, generateMockPricingPaymarket())).toBe(pricingPayMarket.CompanyPayMarketId);
  });

});
