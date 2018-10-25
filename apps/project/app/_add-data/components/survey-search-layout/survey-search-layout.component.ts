import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-survey-search-layout',
  templateUrl: './survey-search-layout.component.html',
  styleUrls: ['./survey-search-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveySearchLayoutComponent {
  @Input() resultsCount: number;

  constructor() { }
}
