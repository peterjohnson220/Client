import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { HighlightHashTagPipe, FormatLinkUrlPipe } from 'libs/core';

import { CommunityTextAreaComponent } from './community-text-area.component';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';
import { escapeSpecialHtmlCharacters } from 'libs/core/helpers/community.helper';

describe('CommunityTextAreaComponent', () => {
  let fixture: ComponentFixture<CommunityTextAreaComponent>;
  let instance: CommunityTextAreaComponent;
  let store: Store<fromCommunityPostReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: CommunityTagApiService,
          useValue: { validateNewCompanyName: jest.fn() }
        }
      ],
      declarations: [
        CommunityTextAreaComponent,
        HighlightHashTagPipe,
        FormatLinkUrlPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityTextAreaComponent);
    instance = fixture.componentInstance;
    instance.parentForm = new FormBuilder().group({
      context:   ['']
    });

  }));

  it('should show community text area', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
