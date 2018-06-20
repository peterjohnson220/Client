// SOURCE: https://gist.github.com/varnastadeus/57006117a61f1877b2dc2d18a93fa011
// https://github.com/ng-bootstrap/ng-bootstrap/issues/933#issuecomment-376474082

import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { filter, takeUntil } from 'rxjs/operators';
import { fromEvent , merge , Subject } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverWindow } from '@ng-bootstrap/ng-bootstrap/popover/popover';

@Directive({
  selector: '[pfHandlePopoverClose][ngbPopover]'
})
export class HandlePopoverCloseDirective implements OnInit, OnDestroy {

  /* tslint:disable:no-input-rename */
  @Input('handlePopoverClose') closeOnPopoverBodyClick = false;

  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private ngbPopover: NgbPopover) {
  }

  ngOnInit() {
    const closedOrDestroyed$ = merge(this.ngbPopover.hidden, this.destroy$);
    const events$ = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'keydown').pipe(filter((event: KeyboardEvent) => event.keyCode === 27)) // esc
    );

    this.ngbPopover.shown.subscribe(() => {
      events$
        .pipe(takeUntil(closedOrDestroyed$))
        .subscribe((event: MouseEvent) => this.handleCloseEvents(event));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleCloseEvents(event: MouseEvent): void {
    if (event.type === 'keydown') {
      this.ngbPopover.close();
      return;
    }

    const target = event.target as Element;
    if (!this.elementRef.nativeElement.contains(target)) {
      const popoverWindowRef: ComponentRef<NgbPopoverWindow> = (this.ngbPopover as any)._windowRef;
      if (!popoverWindowRef.location.nativeElement.contains(event.target) || this.closeOnPopoverBodyClick) {
        this.ngbPopover.close();
      }
    }
  }
}
