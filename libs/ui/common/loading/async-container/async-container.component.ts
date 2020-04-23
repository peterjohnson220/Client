import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';

import { WindowRef } from 'libs/core/services';
import { LoadingProgressBarModel } from '../models';

@Component({
  selector: 'pf-async-container',
  templateUrl: './async-container.component.html',
  styleUrls: ['./async-container.component.scss']
})
export class AsyncContainerComponent implements OnChanges {
  @Input() smartLoadingMask = false;
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() loadingErrorMessage: string;
  @Input() reloadText = 'Reload';
  @Input() hideReloadButton: boolean;
  @Input() noOpactity: boolean;
  @Input() spinnerType = 'SVG';
  @Input() showSpinner = true;
  @Input() opacityLevel = 0.8;
  @Input() loadingProgress: LoadingProgressBarModel;

  @Output() reload = new EventEmitter();

  // 'Smart' Loading mask
  showLoadingMask = false;
  private startTime: number;
  private smartLoadingMaskWindowMin = 200;
  private smartLoadingMaskWindowMax = 300;
  private smartLoadingMaskBuffer = 100;
  private loadingMaskShowTimerId: number;
  private loadingMaskBufferTimerId: number;

  constructor(
    private winRef: WindowRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.smartLoadingMask) {
      this.initSmartLoadingMask(changes['loading']);
    }
  }

  // 'Smart' Loading mask. This method will help improve the user experience with our loading mask's by not
  // showing the mask unless the loading has taken more the smartLoadingMaskWindowMin. It will also prevent "flickering"
  // of the loading mask by adding a buffer onto any loading that completes within the "window". For any loading that
  // completes after the window, we will immediately hide the loading mask.
  private initSmartLoadingMask(loadingInputChange: SimpleChange) {
    if (!loadingInputChange) {
      return;
    }

    if (!loadingInputChange.previousValue && loadingInputChange.currentValue === true) {
      this.handleLoadingStarted();
    }

    if (loadingInputChange.previousValue === true && loadingInputChange.currentValue === false) {
      this.handleLoadingEnded();
    }
  }

  private handleLoadingStarted() {
    this.startTime = new Date().getTime();

    this.winRef.nativeWindow.clearTimeout(this.loadingMaskBufferTimerId);

    this.loadingMaskShowTimerId = this.winRef.nativeWindow.setTimeout(() => {
      this.showLoadingMask = true;
    }, this.smartLoadingMaskWindowMin);
  }

  private handleLoadingEnded() {
    const loadingCompleteTime = (new Date().getTime() - this.startTime);

    // Before the window
    if (loadingCompleteTime < this.smartLoadingMaskWindowMin) {
      this.winRef.nativeWindow.clearTimeout(this.loadingMaskShowTimerId);
      // Inside the window
    } else if (loadingCompleteTime < this.smartLoadingMaskWindowMax) {
      this.loadingMaskBufferTimerId = this.winRef.nativeWindow.setTimeout(() => {
        this.showLoadingMask = false;
      }, this.smartLoadingMaskBuffer);
      // After the window
    } else {
      this.showLoadingMask = false;
    }
  }
}
