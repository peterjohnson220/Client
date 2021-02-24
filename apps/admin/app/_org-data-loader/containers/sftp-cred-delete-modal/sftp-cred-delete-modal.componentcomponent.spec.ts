import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { SftpCredtDeleteModalComponent } from './sftp-cred-delete-modal.component';
import * as fromSftpReducer from '../../reducers';

describe('SftpCredtDeleteModalComponent', () => {
  let component: SftpCredtDeleteModalComponent;
  let fixture: ComponentFixture<SftpCredtDeleteModalComponent>;
  let store: Store<fromSftpReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SftpCredtDeleteModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('orgDataLoader', fromSftpReducer.reducers)
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SftpCredtDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
