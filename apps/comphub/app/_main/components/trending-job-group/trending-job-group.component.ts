import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TrendingJobGroup } from '../../models';
import { WindowRef } from '../../services';

@Component({
  selector: 'pf-trending-job-group',
  templateUrl: './trending-job-group.component.html',
  styleUrls: ['./trending-job-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendingJobGroupComponent {
  @Input() trendingJobGroup: TrendingJobGroup;
  @Input() disabled: boolean;
  @Output() trendingJobClicked = new EventEmitter<string>();

  constructor(public winRef: WindowRef) {}

  get groupType() {
    return !!this.trendingJobGroup.Name ? `${this.trendingJobGroup.Group}: ` : '';
  }

  get groupDisplay() {
      return this.trendingJobGroup.Name || this.trendingJobGroup.Group;
  }

  handleTrendingJobClicked(trendingJob: string) {
    // Don't emit when highlighting text
    if (this.winRef.nativeWindow.getSelection().toString().length === 0 && !this.disabled) {
      this.trendingJobClicked.emit(trendingJob);
    }
  }
}
