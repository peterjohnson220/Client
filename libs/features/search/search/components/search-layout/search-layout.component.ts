import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLayoutComponent {
  @Input() resultsCount: number;

  @Input() countLabel = 'Jobs';

  constructor() { }
}
