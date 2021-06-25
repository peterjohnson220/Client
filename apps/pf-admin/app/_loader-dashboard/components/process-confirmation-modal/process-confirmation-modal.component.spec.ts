import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessConfirmationModalComponent } from './process-confirmation-modal.component';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

describe('ProcessConfirmationModalComponent', () => {
  let component: ProcessConfirmationModalComponent;
  let fixture: ComponentFixture<ProcessConfirmationModalComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          loaderdashboard_main: combineReducers(fromLoaderDashboardPageReducer.reducers)
        }),
        GridModule
      ],
      declarations: [ ProcessConfirmationModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProcessConfirmationModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
