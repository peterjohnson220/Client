import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrsTitleControlComponent } from './trs-title-control.component';
import { generateMockTitleControl, StatementModeEnum, TitleControl } from '../../models';

describe('TrsTitleControlComponent', () => {
  let component: TrsTitleControlComponent;
  let fixture: ComponentFixture<TrsTitleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsTitleControlComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsTitleControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.controlData = {
      Title: {}
    } as TitleControl;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show in edit mode', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should show when in preview mode', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });
});
