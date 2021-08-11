import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { CompensableFactorModel } from 'libs/models/comphub';

import { CompensableFactorTypes } from '../../constants';
import * as fromComphubCsdReducer from '../../reducers';
import * as fromCompensableFactorsActions from '../../actions/compensable-factors.actions';


@Component({
  selector: 'pf-compensable-factor-type',
  templateUrl: './compensable-factor-type.component.html',
  styleUrls: ['./compensable-factor-type.component.scss']
})
export class CompensableFactorTypeComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() compensableFactorName: string;
  @Input() selectedJobTitle: string;
  @Input() factorType: number;
  @Input() title: string;
  @Input() description: string;
  @Input() searchPlaceHolder: string;
  @Input() compensableFactors: CompensableFactorModel[];
  @Input() topFactorsHeading: string;
  @Input() smallDropDown: boolean;
  @Input() defaultDropDownValue: string;
  @Input() selectedPaymarketId: number;

  topFactorsForm: FormGroup;
  factorTypes = CompensableFactorTypes;
  searchFactors: CompensableFactorModel[];
  topFactors: CompensableFactorModel[];
  selectedFactors: CompensableFactorModel[];
  _maxSelections: boolean;
  disabledCheckBox: number[];
  selectedFactors$: Observable<any>;
  selectedFactorsSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public store: Store<fromComphubCsdReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.topFactorsForm = this.formBuilder.group({
      checkList: new FormArray([])
    });

    this.selectedFactors$ = this.store.select(fromComphubCsdReducer.getSelectedFactors);
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  get topFactorsFormArray() {
    return this.topFactorsForm.controls.checkList as FormArray;
  }

  get maxSelections() {
    return this._maxSelections;
  }

  set maxSelections(value: boolean) {
    this._maxSelections = value;
  }

  disableCheckBoxes() {
    this.topFactorsForm.value.checkList
      .map((checked, i) => {
        if (!checked) {
          this.disabledCheckBox.push(i);
          this.topFactorsFormArray.controls[i].disable();
        }
      });
  }

  addCheckBoxes() {
    this.topFactors.forEach(() => this.topFactorsFormArray.push(new FormControl(false)));
  }

  removeOldCheckBoxes() {
    while (this.topFactorsFormArray.length !== 0) {
      this.topFactorsFormArray.removeAt(0);
    }
  }

  topFactorChecked(factor: CompensableFactorModel) {
    this.store.dispatch(new fromCompensableFactorsActions.ToggleSelectedCompensableFactor(
      {compensableFactor: this.compensableFactorName, Name: factor.Name}));
    this.maxSelectionValidation();
  }

  maxSelectionValidation() {
    if (this.selectedFactors.length >= 5) {
      this.maxSelections = true;
      this.disableCheckBoxes();
    } else {
      this.maxSelections = false;
      if (this.disabledCheckBox.length) {
        this.disabledCheckBox.forEach(i => {
          this.topFactorsFormArray.controls[i].enable();
        });
        this.disabledCheckBox = [];
      }
    }
  }

  pillClicked(factorName: string) {
    const selectedTopFactor = this.topFactors.find(x => x.Name === factorName);
    if (!!selectedTopFactor) {
      const index = this.topFactors.indexOf(selectedTopFactor);
      this.topFactorsFormArray.controls[index].setValue(false);
    }
    this.store.dispatch(new fromCompensableFactorsActions.ToggleSelectedCompensableFactor({
      compensableFactor: this.compensableFactorName,
      Name: factorName
    }));
    this.maxSelectionValidation();
  }

  handleSearchValueSelected(factorName: string) {
    if (factorName !== '') {
      this.store.dispatch(new fromCompensableFactorsActions.ToggleSelectedCompensableFactor({
        compensableFactor: this.compensableFactorName,
        Name: factorName
      }));
    }
    this.maxSelectionValidation();
  }

  handleDropDownValueSelected(factorName: string) {
    if (!!factorName) {
      this.store.dispatch(new fromCompensableFactorsActions.ToggleSelectedCompensableFactor({
        compensableFactor: this.compensableFactorName,
        Name: this.selectedFactors[0].Name
      }));
      this.store.dispatch(new fromCompensableFactorsActions.ToggleSelectedCompensableFactor({
        compensableFactor: this.compensableFactorName,
        Name: factorName
      }));
    }
  }

  ngOnInit(): void {
    this.selectedFactors = [];
    this.selectedFactorsSub = this.selectedFactors$.subscribe(factors => {
      if (!!factors[this.compensableFactorName]) {
        this.selectedFactors = factors[this.compensableFactorName];
      }
    });
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.selectedJobTitle) {
      if (!changes.selectedJobTitle.firstChange) {
        this.removeOldCheckBoxes();
        this.initializeData();
      }
    } else if (!!changes.selectedPaymarketId) {
      if (!changes.selectedPaymarketId.firstChange) {
        this.removeOldCheckBoxes();
        this.initializeData();
      }
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.selectedFactorsSub.unsubscribe();
  }

  private initializeData() {
    this.maxSelections = false;
    this.disabledCheckBox = [];
    this.topFactors = this.compensableFactors.slice(0, 5);
    this.searchFactors = this.compensableFactors.slice(5);
    this.addCheckBoxes();
  }

}
