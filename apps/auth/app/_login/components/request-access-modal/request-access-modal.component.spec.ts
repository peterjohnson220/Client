import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { PfFormsModule } from 'libs/forms/forms.module';

import * as fromRootState from 'libs/state/state';
import * as fromLoginReducer from './../../reducers';

import { RequestAccessModalComponent } from './request-access-modal.component';

describe('RequestAccessModalComponent', () => {
  let component: RequestAccessModalComponent;
  let fixture: ComponentFixture<RequestAccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          authMain: combineReducers(fromLoginReducer.reducers)
        }),
        PfFormsModule
      ],
      declarations: [RequestAccessModalComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
