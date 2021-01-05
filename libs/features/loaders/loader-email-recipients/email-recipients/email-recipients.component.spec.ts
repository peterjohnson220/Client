import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { UserApiService } from 'libs/data/payfactors-api/user';

import { EmailRecipientsComponent } from './email-recipients.component';
import { GenerateMockEmailRecipient } from '../../../../models/data-loads';
import * as fromEmailRecipientsActions from '../actions/email-recipients.actions';

describe('EmailRecipientsComponent', () => {
  let component: EmailRecipientsComponent;
  let fixture: ComponentFixture<EmailRecipientsComponent>;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [ EmailRecipientsComponent ],
      providers: [
        {
          provide: UserApiService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(EmailRecipientsComponent);
    component = fixture.componentInstance;
    component.recipients = [GenerateMockEmailRecipient()];
    component.savingError$ = of(false);
    component.removingError$ = of(false);
    component.emailRecipientsModalOpen$ = of(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a SavingEmailRecipientAction when a recipient has been selected', () => {
    spyOn(store, 'dispatch');
    component.loaderConfigurationGroupId = 1;
    component.recipients[0].LoaderConfigurationGroupId = 1;
    const expectedAction = new fromEmailRecipientsActions.SavingEmailRecipient(component.recipients[0], undefined);
    component.errorText = 'failed saving recipient';

    fixture.detectChanges();

    component.onRecipientSelected(component.recipients[0]);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(component.errorText).toEqual('');
  });

  it('should dispatch a RemovingEmailRecipientAction when the user clicks on the remove button', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromEmailRecipientsActions.RemovingEmailRecipient(component.recipients[0]);
    component.errorText = 'failed to remove recipient';

    fixture.detectChanges();

    component.clearRecipient(component.recipients[0]);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(component.errorText).toEqual('');
  });
});
