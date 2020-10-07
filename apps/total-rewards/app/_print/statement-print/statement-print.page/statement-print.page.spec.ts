import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import { StatementForPrint, generateMockStatementWithSingleControl, generateMockImageControl } from 'libs/features/total-rewards/total-rewards-statement/models';
import { generateMockChartControl } from 'libs/features/total-rewards/total-rewards-statement/models/chart-control';

import * as fromStatementPrintReducer from '../reducers';
import { StatementPrintPageComponent } from './statement-print.page';

describe('StatementPrintPageComponent', () => {
  let component: StatementPrintPageComponent;
  let fixture: ComponentFixture<StatementPrintPageComponent>;
  let store: Store<fromStatementPrintReducer.State>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards_statementPrint: combineReducers(fromStatementPrintReducer.reducers)
        }),
      ],
      declarations: [StatementPrintPageComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of(1) },
        }],
        schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(StatementPrintPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set images and charts as not loaded when the statement is falsy', () => {
    // arrange
    const statement = null;

    // act
    component.handleStatementChange(statement);

    // assert
    expect(component.areAllImagesLoaded).toBeFalsy();
    expect(component.areAllChartsRendered).toBeFalsy();
  });

  it('should set images as not loaded when the statement has one or more image controls with a FileUrl defined', () => {
    // arrange
    const imageControl = { ...generateMockImageControl(), FileUrl: 'file/url' };
    const statement = { ...generateMockStatementWithSingleControl(null, imageControl as any) } as StatementForPrint;
    statement.EmployeeRewardsData = [{} as any];

    // act
    component.handleStatementChange(statement);

    // assert
    expect(component.areAllImagesLoaded).toBeFalsy();
  });

  it('should set images as loaded when the statement has no image controls with a FileUrl defined', () => {
    // arrange
    const imageControl = { ...generateMockImageControl(), FileUrl: undefined };
    const statement = { ...generateMockStatementWithSingleControl(null, imageControl as any) } as StatementForPrint;
    statement.EmployeeRewardsData = [{} as any];

    // act
    component.handleStatementChange(statement);

    // assert
    expect(component.areAllImagesLoaded).toBeTruthy();
  });

  it('should set charts as not rendered when the statement has one or more chart controls', () => {
    // arrange
    const chartControl = generateMockChartControl();
    const statement = { ...generateMockStatementWithSingleControl(null, chartControl as any) } as StatementForPrint;
    statement.EmployeeRewardsData = [{} as any];

    // act
    component.handleStatementChange(statement);

    // assert
    expect(component.areAllChartsRendered).toBeFalsy();
  });

  it('should signal the PDF is not ready for generation when all loading requirements are outstanding', () => {
    // arrange
    component.areAllImagesLoaded = false;
    component.areAllChartsRendered = false;
    component.statement$ = of(null);

    // act
    fixture.detectChanges();

    // assert
    const readyForPdfNode = fixture.debugElement.query(By.css(TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR));
    expect(readyForPdfNode).toBeFalsy();
  });

  it('should signal the PDF is not ready for generation when some loading requirements are outstanding', () => {
    // arrange
    component.areAllImagesLoaded = false;
    component.areAllChartsRendered = false;
    component.statement$ = of({ EmployeeRewardsData: [{} as any] }) as any;

    // act
    fixture.detectChanges();

    // assert
    const readyForPdfNode = fixture.debugElement.query(By.css(TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR));
    expect(readyForPdfNode).toBeFalsy();
  });

  it('should signal the PDF is ready for generation when all loading requirements are met', () => {
    // arrange
    component.areAllImagesLoaded = true;
    component.areAllChartsRendered = true;
    component.statement$ = of({ EmployeeRewardsData: [{} as any] }) as any;

    // act
    fixture.detectChanges();

    // assert
    const readyForPdfNode = fixture.debugElement.query(By.css(TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR));
    expect(readyForPdfNode).toBeTruthy();
  });
});
