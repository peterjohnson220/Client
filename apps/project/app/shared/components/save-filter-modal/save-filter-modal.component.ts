import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';

@Component({
  selector: 'pf-save-filter-modal',
  templateUrl: './save-filter-modal.component.html',
  styleUrls: ['./save-filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveFilterModalComponent implements OnInit {
  @Input() savingFilterConflict: boolean;
  @Input() savingFilterError: boolean;
  @Input() savingFilters: boolean;
  @Input() isOpen$: Observable<boolean>;
  @Output() saveFilter = new EventEmitter<{ Name: string; SetAsPayMarketDefault: boolean}>();
  @Output() dismissed = new EventEmitter();

  nameFilterForm: FormGroup;
  showErrorMessages: boolean;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.nameFilterForm = this.fb.group({
      'name': ['', [PfValidators.required, Validators.maxLength(255)]],
      'setAsPayMarketDefault': ['']
    });
  }

  // Events
  handleModalSubmit() {
    this.showErrorMessages = true;
    this.saveFilter.emit({
      Name: this.nameFilterForm.value.name,
      SetAsPayMarketDefault: this.nameFilterForm.value.setAsPayMarketDefault
    });
  }

  handleModalDismiss() {
    this.dismissed.emit();
  }
}
