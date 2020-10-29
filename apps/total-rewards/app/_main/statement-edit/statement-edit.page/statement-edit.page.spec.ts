import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { TimeElapsedPipe } from 'libs/core/pipes/time-elapsed.pipe';
import { StatementModeEnum, Statement, generateMockStatement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromStatementEditReducer from '../reducers';
import { StatementEditPageComponent } from './statement-edit.page';

describe('StatementEditPageComponent', () => {
  let component: StatementEditPageComponent;
  let fixture: ComponentFixture<StatementEditPageComponent>;
  let store: Store<fromStatementEditReducer.State>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards_statementEdit: combineReducers(fromStatementEditReducer.reducers)
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
        }],
        schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(StatementEditPageComponent);
    component = fixture.componentInstance;

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
    expect(pageHtml.textContent).toContain('Canvas cannot be edited in preview mode');
    expect(pageHtml.querySelector('button.mode-button').textContent).toContain('Edit');
  });

  it('should show `edit` characteristics in the page when in edit mode', () => {
    // arrange
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const pageHtml = fixture.debugElement.nativeElement as HTMLElement;
    expect(pageHtml.textContent.includes('Canvas cannot be edited in preview mode')).toBeFalsy();
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
});
