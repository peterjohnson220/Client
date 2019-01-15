import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { CompositeSummaryDownloadComponent } from './composite-summary-download.component';

describe('Dashboard - Main - Composite Summary Download', () => {
  let fixture: ComponentFixture<CompositeSummaryDownloadComponent>;
  let instance: CompositeSummaryDownloadComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        CompositeSummaryDownloadComponent
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {compositeDataLoadExternalId: '123', action: 'test'}
          }
        }
      }],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CompositeSummaryDownloadComponent);
    instance = fixture.componentInstance;
  });

  it('should open URL in new tab on Init', () => {
    const expectedUri = '/odata/Integration/AuthRedirect?compositeDataLoadExternalId=123&action=test';
    spyOn(window, 'open');
    fixture.detectChanges();


    expect(window.open).toHaveBeenCalledWith(expectedUri);
  });
});
