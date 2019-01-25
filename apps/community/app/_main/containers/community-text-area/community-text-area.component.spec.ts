import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { PfLinkifyService } from '../../services/pf-linkify-service';
import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { CommunityTextAreaComponent } from './community-text-area.component';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

describe('CommunityTextAreaComponent', () => {
  let fixture: ComponentFixture<CommunityTextAreaComponent>;
  let instance: CommunityTextAreaComponent;
  let store: Store<fromCommunityPostReducer.State>;
  let pfLinkifyService: PfLinkifyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPostRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
        NgxLinkifyjsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: CommunityTagApiService,
          useValue: { validateNewCompanyName: jest.fn() }
        },
        {
          provide: PfLinkifyService,
          useValue: { getLinks: jest.fn() }
        }
      ],
      declarations: [
        CommunityTextAreaComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    pfLinkifyService = TestBed.get(PfLinkifyService);

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
