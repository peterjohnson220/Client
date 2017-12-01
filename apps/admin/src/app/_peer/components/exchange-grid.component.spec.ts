import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ExchangeGridComponent } from './exchange-grid.component';


describe('Exchange Grid', () => {
  let fixture: ComponentFixture<ExchangeGridComponent>;
  let instance: ExchangeGridComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExchangeGridComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExchangeGridComponent);
    instance = fixture.componentInstance;
  });

  it('should compile', () => {

    instance.exchangeListItems = [];
    instance.loading = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  // it('should show the loading mask, when there is a loading error', () => {
  //
  //   instance.exchangeListItems = [];
  //   instance.loadingError = true;
  //
  //   fixture.detectChanges();
  //
  //   expect(fixture).toMatchSnapshot();
  // });
});
