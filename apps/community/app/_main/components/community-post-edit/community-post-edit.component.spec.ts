import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import 'rxjs/add/observable/of';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { CommunityPostEditComponent } from './community-post-edit.component';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';

describe('CommunityPostEditComponent', () => {
  let fixture: ComponentFixture<CommunityPostEditComponent>;
  let instance: CommunityPostEditComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
      ],
      declarations: [ CommunityPostEditComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostEditComponent);
    instance = fixture.componentInstance;
    instance.post = generateMockCommunityPost();
  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
