import { Component, Input } from '@angular/core';

import { Match } from 'libs/models/company';

@Component({
  selector: 'pf-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent {
  @Input() match: Match;

  showMore: boolean;

  toggleShowMore() {
      this.showMore = !this.showMore;
  }

}
