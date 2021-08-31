import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { TimeElapsedPipe } from 'libs/core/pipes/time-elapsed.pipe';
import { StatementModeEnum, Statement, generateMockStatement } from 'libs/features/total-rewards/total-rewards-statement/models';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromStatementEditReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions';
import { StatementEditPageComponent } from './statement-edit.page';

const each = require('jest-each').default;

describe('StatementEditPageComponent', () => {
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  let component: StatementEditPageComponent;
  let fixture: ComponentFixture<StatementEditPageComponent>;
  let store: Store<fromStatementEditReducer.State>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  let mainScrollableNode: HTMLDivElement;

  let settingsService: SettingsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards_statementEdit: combineReducers(fromStatementEditReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers)
        }),
      ],
      declarations: [StatementEditPageComponent, TimeElapsedPipe],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of(1) },
        },
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(false)},
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        }
      ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
  }));

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(StatementEditPageComponent);
    component = fixture.componentInstance;
    settingsService = TestBed.inject(SettingsService);

    // arrange, make sure there's a node that comes back on a `.page-content` query so scroll listener won't fail
    mainScrollableNode = document.createElement('div');
    mainScrollableNode.className = 'page-content';
    document.body.appendChild(mainScrollableNode);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show `preview` characteristics in the page when in preview mode', () => {
    // arrange
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.querySelector('button.mode-button').textContent).toContain('Edit');
  });

  it('should show `edit` characteristics in the page when in edit mode', () => {
    // arrange
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.querySelector('button.mode-button').textContent).toContain('Preview');
  });

  it('should show a saving message when saving the statement', () => {
    // arrange
    component.statementSaving$ = of(true);

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.textContent).toContain('Saving');
  });

  it('should show a saving message when saving settings', () => {
    // arrange
    component.settingsSaving$ = of(true);

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.textContent).toContain('Saving');
  });

  it('should show a previously saved message when an edited date exists', () => {
    // arrange
    component.settingsSaving$ = of(false);
    component.statementSaving$ = of(false);
    component.statement = { ...generateMockStatement(), AuditRecord: { EditedDateTime: new Date('4/21/2020') }} as Statement;

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.textContent).toContain('Saved');
    expect(pageHtml.textContent).toContain('ago');
  });

  it('handlePageScroll should dispatch a scroll true action followed by a scroll false', fakeAsync(() => {
    // arrange
    const scrollTrueAction = new fromEditStatementPageActions.PageScroll({ isScrolling: true });
    const scrollFalseAction = new fromEditStatementPageActions.PageScroll({ isScrolling: false });

    // act
    component.handlePageScroll();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(scrollTrueAction);
    expect(store.dispatch).not.toHaveBeenCalledWith(scrollFalseAction);

    tick(1000);

    expect(store.dispatch).toHaveBeenCalledWith(scrollFalseAction);
  }));

  it.each([
    [true, true],
    [false, false]
  ])('Download Statement Preview button should be disabled: %s while statement generating is %s', (isGenerating: boolean, expectedDisabled: boolean) => {
    // arrange
    component.mode = StatementModeEnum.Preview;
    component.statementPreviewGenerating$ = of(isGenerating);

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    const actualDisabled = pageHtml.querySelector('#preview-download-button[disabled]') !== null;

    expect(actualDisabled).toBe(expectedDisabled);
  });
});

