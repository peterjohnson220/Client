import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { LoadingProgressBarService } from './service';
import {GetLoadingProgressDefaults, LoadingProgressBarModel} from './models';

@Component({
  selector: 'pf-loading-indicator',
  templateUrl: './loading-indicator.component.html'
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  @Input() spinnerType = 'SVG';
  @Input() message: string;
  @Input() loadingProgress: LoadingProgressBarModel;

  spinnerGifUrl = '../../marketdata/images/waittrans.gif';
  private startValue = 0;

  constructor(private progressBar: LoadingProgressBarService) {
    this.progressBar.progressBar()
      .subscribe({
        next: p => {
          this.startValue = p;
        }
      });
  }

  ngOnInit(): void {
    if (this.spinnerType === 'PROGRESS') {
      if (this.loadingProgress === undefined || this.loadingProgress === null) {
        this.loadingProgress = GetLoadingProgressDefaults();
      }
      this.progressBar.start(this.loadingProgress);
    }
  }

  ngOnDestroy(): void {
    if (this.spinnerType === 'PROGRESS') {
      this.progressBar.stop(true);
    }
  }
}
