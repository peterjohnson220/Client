import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'pf-employee-history-date-picker',
  templateUrl: './employee-history-date-picker-modal.component.html',
  styleUrls: ['./employee-history-date-picker-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeHistoryDatePickerModalComponent implements OnChanges, OnInit, OnDestroy {
  @Input() isOpen$: Observable<boolean>;
  @Input() title = 'View Employee History';
  @Input() initialDate = null;
  @Output() applyClicked = new EventEmitter<string>();
  @Output() cancelClick = new EventEmitter();

  historyForm: FormGroup;
  openModalSubscription: Subscription;
  public maxHistoryDate: Date = this.getYesterdaysDate();

  constructor(private intlService: IntlService,
              private formBuilder: FormBuilder) {
    this.createForm();
  }

  get f() { return this.historyForm.controls; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initialDate) {
      this.historyForm.controls['employeeHistoryDate'].setValue(this.initialDate);
    }
  }

  ngOnInit(): void {
    this.openModalSubscription = this.isOpen$.subscribe(isOpen => {
      if (isOpen && this.initialDate) {
        this.historyForm.controls['employeeHistoryDate'].setValue(this.initialDate);
      }
    });
  }

  ngOnDestroy(): void {
    this.openModalSubscription.unsubscribe();
  }

  handleCancelClicked() {
    this.cancelClick.emit();
  }

  handleApplyClicked() {
    this.applyClicked.emit(this.intlService.formatDate(this.historyForm.value.employeeHistoryDate, 'yyyy-MM-dd'));
  }

  private getYesterdaysDate(): Date {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  private createForm(): void {
    this.historyForm = this.formBuilder.group({
      employeeHistoryDate: [null, [
        Validators.required]]
    });
  }
}
