import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { generateDefaultAsyncStateObj } from 'libs/models';

import { generateMockMatchResult, MatchResult } from '../../models';
import { MatchResultsComponent } from './match-results.component';


describe('Pf-Admin - Utilities - Match Results', () => {
  let instance: MatchResultsComponent;
  let fixture: ComponentFixture<MatchResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchResultsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MatchResultsComponent);
    instance = fixture.componentInstance;
  });

  it('Should emit that a filter was clicked with the type, when handling a filter click', () => {
    spyOn(instance.filterClicked, 'emit');
    const type = 'Exact';

    instance.handleFilterClicked(type);

    expect(instance.filterClicked.emit).toHaveBeenCalledWith(type);
  });

  it('Should emit that a match result was selected with the value, when handling a match result being clicked', () => {
    spyOn(instance.matchResultSelected, 'emit');
    const matchResult = generateMockMatchResult();

    instance.handleMatchResultClicked(matchResult);

    expect(instance.matchResultSelected.emit).toHaveBeenCalledWith(matchResult);
  });

  it('Should track match results by the match result Id', () => {
    const matchResult = generateMockMatchResult();

    const tracking = instance.trackByFn(matchResult, 1);

    expect(tracking).toBe(matchResult.Id);
  });

  it('Should emit that a apply exact match was clicked with the value, when handling a apply exact match being clicked', () => {
    spyOn(instance.applyExactMatchClicked, 'emit');
    const matchResult = generateMockMatchResult();
    const mouseEvent = new MouseEvent('click');

    instance.handleApplyExactMatchClicked(matchResult, mouseEvent);

    expect(instance.applyExactMatchClicked.emit).toHaveBeenCalledWith(matchResult);
  });

  it('Should stop propagation on the mouse event, when handling a apply exact match being clicked', () => {
    const matchResult = generateMockMatchResult();
    const mouseEvent = new MouseEvent('click');
    spyOn(mouseEvent, 'stopPropagation');

    instance.handleApplyExactMatchClicked(matchResult, mouseEvent);

    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
  });

  it('Should return 0 for the match count when we have no match results', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>([]);

    expect(instance.matchCount).toBe(0);
  });

  it('Should return 0 for the exact match count when we have no match results', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>([]);

    expect(instance.exactMatchCount).toBe(0);
  });

  it('Should return 0 for the non match count when we have no match results', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>([]);

    expect(instance.nonMatchCount).toBe(0);
  });

  it('Should return the length of the match results for the match count', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>([generateMockMatchResult()]);

    expect(instance.matchCount).toBe(1);
  });

  it('Should return the exact match count, when we have match results', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>(
      [generateMockMatchResult(), {...generateMockMatchResult(), IsExactMatch: true}]
    );

    expect(instance.exactMatchCount).toBe(1);
  });

  it('Should return the length of match results minus the exact match count for the non match count', () => {
    instance.matchResultsAsync = generateDefaultAsyncStateObj<MatchResult[]>(
      [generateMockMatchResult(), generateMockMatchResult(), {...generateMockMatchResult(), IsExactMatch: true}]
    );

    expect(instance.nonMatchCount).toBe(2);
  });
});
