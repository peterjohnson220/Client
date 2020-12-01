import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as fromAutoShareActions from 'libs/features/user-settings/actions/auto-share.actions';
import * as fromAutoShareReducer from 'libs/features/user-settings/reducers';
import { AutoShareComponent } from './auto-share.component';
import { Store, StoreModule } from '@ngrx/store';

describe('AutoShareComponent', () => {
  let fixture: ComponentFixture<AutoShareComponent>;
  let instance: AutoShareComponent;
  let store: Store<fromAutoShareReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromAutoShareReducer.reducers
        })
      ],
      declarations: [ AutoShareComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(AutoShareComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch OpenAutoShareModal action when handleAddClicked is called', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromAutoShareActions.OpenAutoShareModal();

    instance.handleAddClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
