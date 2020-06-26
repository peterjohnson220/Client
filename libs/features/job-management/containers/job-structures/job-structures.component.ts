import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SimplePaymarket, SimpleGrade, CompanyStructure, CompanyStructurePaymarketGrade, CompanyStructureInfo } from 'libs/models';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'pf-job-structures',
  templateUrl: './job-structures.component.html',
  styleUrls: ['./job-structures.component.scss']
})
export class JobStructuresComponent implements OnInit, OnDestroy {

  structuresSubscription: Subscription;
  structuresListSubscription: Subscription;
  selectedStructureIdSubscription: Subscription;
  paymarketGradeListSubscription: Subscription;

  paymarketGradeList: CompanyStructurePaymarketGrade[];
  structuresList: CompanyStructure[];
  paymarketsList: SimplePaymarket[];
  gradesList: SimpleGrade[];
  structures: CompanyStructureInfo[];

  structureId: number;
  paymarketId: number;
  gradeId: number;

  errorMessage = '';

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  constructor(private store: Store<fromJobManagementReducer.State>) {
    this.structuresSubscription = this.store.select(fromJobManagementReducer.getStructures).subscribe(value => {
      this.structures = value;
      this.errorMessage = '';
    });

    this.structuresListSubscription = this.store.select(fromJobManagementReducer.getStructuresList).subscribe(value => {
      this.structuresList = value;
      this.errorMessage = '';
    });

    this.selectedStructureIdSubscription = this.store.select(fromJobManagementReducer.getSelectedStructureId).subscribe(value => {
      this.structureId = value;
      this.errorMessage = '';
    });

    this.paymarketGradeListSubscription = this.store.select(fromJobManagementReducer.getPaymarketGradeList).subscribe(value => {
      this.paymarketGradeList = value;
      this.updatePaymarketList();
      this.errorMessage = '';
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.paymarketGradeListSubscription.unsubscribe();
    this.selectedStructureIdSubscription.unsubscribe();
    this.paymarketGradeListSubscription.unsubscribe();
  }

  updatePaymarketList() {
    this.paymarketsList = Array.from(new Set(this.paymarketGradeList.map(a => a.CompanyPayMarketId)))
      .map(id => this.paymarketGradeList.find(a => a.CompanyPayMarketId === id))
      .map(o => ({
        CompanyPayMarketId: o.CompanyPayMarketId,
        PayMarket: o.PayMarket
      }));

    if (this.paymarketsList.length > 1) {
      this.paymarketsList = [{ CompanyPayMarketId: -1, PayMarket: '*ALL*' }].concat(this.paymarketsList);
    }

    this.paymarketId = this.paymarketsList && this.paymarketsList.length > 0 ? this.paymarketsList[0].CompanyPayMarketId : null;

    this.updateGrade();
  }

  updateGrade() {

    if (this.paymarketId === -1) {
      this.gradesList = Array.from(new Set(this.paymarketGradeList.map(a => a.CompanyStructuresGradesId)))
        .map(id => this.paymarketGradeList.find(a => a.CompanyStructuresGradesId === id))
        .map(o => ({
          CompanyStructuresGradesId: o.CompanyStructuresGradesId,
          GradeName: o.GradeName
        }));
    } else {
      this.gradesList = this.paymarketGradeList
        .filter(a => a.CompanyPayMarketId === this.paymarketId)
        .map(o => ({
          CompanyStructuresGradesId: o.CompanyStructuresGradesId,
          GradeName: o.GradeName
        }));
    }

    this.gradeId = this.gradesList && this.gradesList.length > 0 ? this.gradesList[0].CompanyStructuresGradesId : null;
  }

  structureChanged(value: any) {
    this.errorMessage = '';
    this.store.dispatch(new fromJobManagementActions.SetSelectedStructureId(value));
  }

  paymarketChanged(value: any) {
    this.errorMessage = '';
    this.paymarketId = value;
    this.updateGrade();
  }

  gradeChanged(value: any) {
    this.errorMessage = '';
    this.gradeId = value;
  }

  addStructureMapping() {
    this.errorMessage = '';
    const selectedStructure = this.structuresList.find(o => o.CompanyStructuresId === this.structureId);

    if (this.paymarketId === -1) {
      this.paymarketsList.forEach(element => {
        const paymarketGrade = this.paymarketGradeList.find(o => o.CompanyStructuresGradesId === this.gradeId
          && o.CompanyPayMarketId === element.CompanyPayMarketId);
        if (element.CompanyPayMarketId !== -1 && paymarketGrade) {
          this.addMapping(selectedStructure, paymarketGrade);
        }
      });
    } else {
      const paymarketGrade = this.paymarketGradeList.find(o => o.CompanyStructuresId === this.structureId
        && o.CompanyPayMarketId === this.paymarketId
        && o.CompanyStructuresGradesId === this.gradeId);
      this.addMapping(selectedStructure, paymarketGrade);
    }

  }

  deleteStructureMapping(id: number) {
    this.errorMessage = '';
    this.store.dispatch(new fromJobManagementActions.DeleteStructureMapping(id));
  }

  private addMapping(structure: CompanyStructure, paymarketGrade: CompanyStructurePaymarketGrade) {
    if (!paymarketGrade) {
      this.errorMessage = 'The structure you selected doesn\'t have any paymarket/grade mappings';
      return;
    } else if (this.structures.filter(o =>
      o.CompanyStructuresId === structure.CompanyStructuresId &&
      o.CompanyPayMarketId === paymarketGrade.CompanyPayMarketId &&
      o.CompanyStructuresGradesId === paymarketGrade.CompanyStructuresGradesId
    ).length > 0) {
      this.errorMessage = 'The structure mapping(s) you are trying to add already exists.';
      return;
    }

    // We need a temp negative unique ID in order to delete newly added structure mappings
    const id = - Math.floor((Math.random() * 100000000000) + 1);

    const newMapping = {
      StructureName: structure.StructureName,
      PayMarket: paymarketGrade.PayMarket,
      GradeName: paymarketGrade.GradeName,
      CompanyPayMarketId: paymarketGrade.CompanyPayMarketId,
      CompanyStructuresId: structure.CompanyStructuresId,
      CompanyStructuresGradesId: paymarketGrade.CompanyStructuresGradesId,
      CompanyStructuresRangeGroupId: id
    };

    this.store.dispatch(new fromJobManagementActions.AddStructureMapping(newMapping));
  }

}
