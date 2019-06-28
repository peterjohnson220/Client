import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AsyncStateObj, MatchResult, SurveyScope } from '../../models';

@Component({
  selector: 'pf-scope-selector',
  templateUrl: './scope-selector.component.html',
  styleUrls: ['./scope-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScopeSelectorComponent {
  @Input() selectedMatch: MatchResult;
  @Input() surveyScopesAsync: AsyncStateObj<SurveyScope[]>;
  @Output() surveyScopeSelected = new EventEmitter<SurveyScope>();
  @Output() applyScopeClicked = new EventEmitter();

  filter: string;

  get surveyScopes() {
    return this.surveyScopesAsync.obj;
  }

  get hasSelection() {
    return !!this.surveyScopes ? this.surveyScopes.some(ss => ss.Selected) : false;
  }

  trackByFn(surveyScope: SurveyScope, index: number) {
    return surveyScope.Id;
  }

  handleSurveyScopeClicked(surveyScope: SurveyScope) {
    this.surveyScopeSelected.emit(surveyScope);
  }

  handleApplyScopeClicked() {
    this.applyScopeClicked.emit();
  }

  handleSearchValueChanged(value: string) {
    this.filter = value;
  }

  constructor() {}
}
