import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { StatementModeEnum } from '../../models';

@Component({
  selector: 'pf-effective-date',
  templateUrl: './effective-date.component.html',
  styleUrls: ['./effective-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffectiveDateComponent implements OnInit {

  @Input() mode: StatementModeEnum;
  @Input() effectiveDate: Date;

  @Output() onDateChange = new EventEmitter<Date>();

  statementModeEnum = StatementModeEnum;
  effectiveDateSubject = new Subject<Date>();
  effectiveDateSubjectSubscription = new Subscription();

  ngOnInit() {
    // don't spam the back end on keystrokes
    this.effectiveDateSubjectSubscription = this.effectiveDateSubject.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe((date: Date) => this.onDateChange.emit(date));
  }

  handleValueChanged(date: Date) {
    this.effectiveDateSubject.next(date);
  }
}
