import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { EmployeeBenefit, SaveEmployeeBenefitsRequest } from 'libs/models/payfactors-api/employees';
import { CompanyEmployee } from 'libs/models/company';

import * as fromEmployeeManagementReducer from '../../reducers';
import * as fromEmployeeBenefitsActions from '../../actions/employee-benefits.actions';

@Component({
  selector: 'pf-employee-benefits',
  templateUrl: './employee-benefits.component.html',
  styleUrls: ['./employee-benefits.component.scss']
})
export class EmployeeBenefitsComponent implements OnInit, OnDestroy {
  @Output() benefitValueChanged: EventEmitter<any> = new EventEmitter();

  employee$: Observable<AsyncStateObj<CompanyEmployee>>;
  employeeBenefitsAsync$: Observable<AsyncStateObj<EmployeeBenefit[]>>;

  employeeSubscription: Subscription;
  employeeBenefitsSubscription: Subscription;

  companyEmployeeId: number;
  employeeId: string;
  employeeBenefits: EmployeeBenefit[];
  hasChanges = false;

  constructor(
    private store: Store<fromEmployeeManagementReducer.State>
  ) {
    this.employee$ = this.store.select(fromEmployeeManagementReducer.getEmployee);
    this.employeeBenefitsAsync$ = this.store.select(fromEmployeeManagementReducer.getEmployeeBenefitsAsync);
  }

  ngOnInit(): void {
    this.employeeSubscription = this.employee$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && !!asyncObj?.obj) {
        this.companyEmployeeId = asyncObj.obj.CompanyEmployeeId;
        this.employeeId = asyncObj.obj.EmployeeId;
        this.store.dispatch(new fromEmployeeBenefitsActions.LoadEmployeeBenefits({
          companyEmployeeId: asyncObj.obj.CompanyEmployeeId,
          employeeId: asyncObj.obj.EmployeeId
        }));
      }
    });
    this.employeeBenefitsSubscription = this.employeeBenefitsAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj?.obj?.length > 0) {
        this.employeeBenefits = cloneDeep(asyncObj.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
    this.employeeBenefitsSubscription.unsubscribe();
  }

  handleBenefitValueChange(benefit: EmployeeBenefit, value: number): void {
    benefit.EmployerValue = value;
    this.hasChanges = true;
    this.benefitValueChanged.emit();
  }

  save(): void {
    if (!this.hasChanges) {
      return;
    }
    const request: SaveEmployeeBenefitsRequest = {
      CompanyEmployeeId: this.companyEmployeeId,
      EmployeeId: this.employeeId,
      Benefits: this.employeeBenefits
    };
    this.store.dispatch(new fromEmployeeBenefitsActions.SaveEmployeeBenefits(request));
  }
}

