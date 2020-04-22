import { Injectable } from '@angular/core';
import { timer, Subject, Observable } from 'rxjs';
import {takeWhile, map } from 'rxjs/operators';
import {LoadingProgressBarModel} from '../models';

@Injectable()
export class LoadingProgressBarService {
  private _progress = new Subject<number>();
  private _stop = false;
  progressBar(): Observable<number> {
    return this._progress.asObservable();
  }

  start(loadingProgress: LoadingProgressBarModel): void {
    let i =  0;
    if (!this._stop) {
      timer(0, 1000).pipe(
        takeWhile(() => !this._stop),
        map(() => {
          let value;
          if (i === loadingProgress.interval + 1) {
            i = 0;
            return i;
          }
          value = i !== 0 ? i * loadingProgress.intervalValue : i;
          i++;
          if (loadingProgress.interval - 1 === i && !loadingProgress.progressive) {
            this._stop = true;
          }
          return value;
        })
      ).subscribe({
        next: t => this._progress.next(t),
        error: null,
        complete: () => {
          this._progress.complete();
          this._progress = new Subject<number>();
          this._stop = false;
        }
      });
    }
  }

  stop(stop: boolean): void {
    this._stop = stop;
  }
}
