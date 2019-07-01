import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterArrayByName } from 'libs/core/pipes';
import { generateDefaultAsyncStateObj } from 'libs/models';

import { generateMockSurveyScope } from '../../models';
import { ScopeSelectorComponent } from './scope-selector.component';

describe('Pf-Admin - Utilities - Scope Selector', () => {
  let instance: ScopeSelectorComponent;
  let fixture: ComponentFixture<ScopeSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeSelectorComponent, FilterArrayByName ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ScopeSelectorComponent);
    instance = fixture.componentInstance;
  });

  it('Should emit that a survey scope was selected, when handling a survey scope clicked', () => {
    spyOn(instance.surveyScopeSelected, 'emit');
    const scope = generateMockSurveyScope();

    instance.handleSurveyScopeClicked(scope);

    expect(instance.surveyScopeSelected.emit).toHaveBeenCalledWith(scope);
  });

  it('Should emit that an apply scope was clicked, when handling an apply scope click', () => {
    spyOn(instance.applyScopeClicked, 'emit');

    instance.handleApplyScopeClicked();

    expect(instance.applyScopeClicked.emit).toHaveBeenCalled();
  });

  it('Should track scopes by the scope Id', () => {
    const scope = generateMockSurveyScope();

    const tracking = instance.trackByFn(scope, 1);

    expect(tracking).toBe(scope.Id);
  });

  it('Should set the filter, when handling the search value changed', () => {
    const searchTerm = 'blah';

    instance.handleSearchValueChanged(searchTerm);

    expect(instance.filter).toBe(searchTerm);
  });

  it('Should return false for hasSelection, when we have no survey scopes', () => {
    instance.surveyScopesAsync = {
      ...generateDefaultAsyncStateObj(),
      obj: []
    };

    expect(instance.hasSelection).toBe(false);
  });

  it('Should return true for hasSelection, when we have any survey scopes that are selected', () => {
    instance.surveyScopesAsync = {
      ...generateDefaultAsyncStateObj(),
      obj: [{
        ...generateMockSurveyScope(),
        Selected: true
      }]
    };

    expect(instance.hasSelection).toBe(true);
  });
});
