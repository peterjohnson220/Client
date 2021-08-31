import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataFieldFilterComponent } from './data-field-filter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { getMockDataTypes } from 'libs/models/security/roles/data-type.model';
import { getMockRoleDataRestrictions } from 'libs/models/security/roles/role-data-restriction.model';


describe('DataFieldFilterComponent', () => {
  let component: DataFieldFilterComponent;
  let fixture: ComponentFixture<DataFieldFilterComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
        }),
      ],
      declarations: [DataFieldFilterComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(DataFieldFilterComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFieldFilterComponent);
    component = fixture.componentInstance;
    component.dataType = getMockDataTypes()[0];
    component.roleDataRestriction = getMockRoleDataRestrictions()[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
