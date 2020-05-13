import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';

import * as fromRootState from 'libs/state/state';

import { CompanyApiService } from '../../../data/payfactors-api/company';
import { UserApiService } from '../../../data/payfactors-api/user';

import { UserOrEmailPickerComponent } from './user-or-email-picker.component';
describe('UserOrEmailPickerComponent', () => {
  let component: UserOrEmailPickerComponent;
  let fixture: ComponentFixture<UserOrEmailPickerComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        FormsModule, NgbModule, ImgFallbackModule
      ],
      declarations: [UserOrEmailPickerComponent],
      providers: [ {
        provide: CompanyApiService
      }, {
        provide: UserApiService
      } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(UserOrEmailPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner when a search is in progress', () => {
    component.searching = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show a spinner when no search is being performed', () => {
    component.searching = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when a search failed', () => {
    component.searchFailed = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
