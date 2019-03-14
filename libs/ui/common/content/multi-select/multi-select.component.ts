import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GenericMenuItem } from 'libs/models/common';

@Component({
  selector: 'pf-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  // add custom getter and setter so we only hookup options once when we have a list of at least one element
  private _options: GenericMenuItem[];
  @Input() set options(value: GenericMenuItem[]) {
    this._options = value;
    if (value.length && !this.form) {
      this.initForm();
    }
  }
  get options(): GenericMenuItem[] {
    return this._options;
  }

  @Input() labelText: string;
  @Input() isExpanded$: Observable<boolean>;
  @Input() isLoading$: Observable<boolean>;
  @Input() selectedOptionNames$: Observable<string[]>;

  @Output() selectFacadeClick = new EventEmitter();
  @Output() checkboxClick = new EventEmitter();
  @Output() clearSelectionsClick = new EventEmitter();

  searchTerm = '';
  form: FormGroup;
  formValuesSubscription: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() { }

  initForm() {
    const formControls = {};

    // loop through each option create a form control for each
    this.options.forEach((option, i) => {
      const formControl = new FormControl(option.IsSelected);
      formControls[option.DisplayName] = formControl;
      const subscription = formControl.valueChanges.subscribe(value => {
        this.checkboxClick.emit({ ...option, IsSelected: value });
      });
      this.formValuesSubscription.add(subscription);
    });

    this.form = new FormGroup(formControls);
  }

  toggleCheckboxPanel() {
    this.selectFacadeClick.emit();
  }

  clearSelections() {
    this.clearSelectionsClick.emit();
  }

  clearSearchTerm() {
    this.searchTerm = '';
  }

  trackByFn(index, item: GenericMenuItem) {
    return (item.Id) ? item.Id : item.DisplayName;
  }

  ngOnDestroy() {
    this.formValuesSubscription.unsubscribe();
  }
}
