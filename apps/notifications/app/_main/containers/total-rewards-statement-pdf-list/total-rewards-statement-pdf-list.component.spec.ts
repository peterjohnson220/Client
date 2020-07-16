import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromNotificationsMainReducer from '../../reducers';
import { TotalRewardsStatementPdfListComponent } from './total-rewards-statement-pdf-list.component';
import { generateTotalRewardsStatementPdf } from '../../models';

describe('TotalRewardsStatementPdfListComponent', () => {
  let component: TotalRewardsStatementPdfListComponent;
  let fixture: ComponentFixture<TotalRewardsStatementPdfListComponent>;
  let store: Store<fromNotificationsMainReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromNotificationsMainReducer.reducers,
          notifications_main: combineReducers(fromNotificationsMainReducer.reducers)
        })
      ],
      declarations: [TotalRewardsStatementPdfListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsStatementPdfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render content when no statement PDFs are available', () => {
    // arrange
    component.totalRewardsStatementPdfs$ = of({ obj: [] } as any);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent).toBeFalsy();
  });

  it('should render cards for each statement PDF', () => {
    // arrange
    component.totalRewardsStatementPdfs$ = of({ obj: [generateTotalRewardsStatementPdf(), generateTotalRewardsStatementPdf()] } as any);

    // act
    fixture.detectChanges();

    // assert
    const statements = fixture.debugElement.nativeElement.querySelectorAll('pf-file-download-card');
    expect(statements.length).toBe(2);
    expect(fixture.debugElement.nativeElement.textContent.indexOf('No Recent Statements')).toBe(-1);
  });

  it('should have a show more when statements exceed display limit', () => {
    // arrange
    component.displayLimit = 1;
    component.totalRewardsStatementPdfs$ = of({ obj: [generateTotalRewardsStatementPdf(), generateTotalRewardsStatementPdf()] } as any);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent.includes('Show More')).toBeTruthy();
  });

  it('should show more statements after clicking Show More', () => {
    // arrange
    component.displayLimit = 1;
    component.totalRewardsStatementPdfs$ = of({ obj: [generateTotalRewardsStatementPdf(), generateTotalRewardsStatementPdf()] } as any);

    // act
    fixture.detectChanges();

    // assert
    let visibleStatements = fixture.debugElement.nativeElement.querySelectorAll('pf-file-download-card:not(.d-none)');
    expect(visibleStatements.length).toBe(1);

    // act
    const button = fixture.debugElement.nativeElement.querySelector('.btn.show-more-btn');
    button.click();
    fixture.detectChanges();

    // assert
    visibleStatements = fixture.debugElement.nativeElement.querySelectorAll('pf-file-download-card:not(.d-none)');
    expect(visibleStatements.length).toBe(2);
  });

});
