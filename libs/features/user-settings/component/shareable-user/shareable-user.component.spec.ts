import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareableUserComponent } from './shareable-user.component';
import { generateMockAutoShareUser } from '../../../../models/user-settings';

describe('ShareableUserComponent', () => {
  let fixture: ComponentFixture<ShareableUserComponent>;
  let instance: ShareableUserComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareableUserComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(ShareableUserComponent);
    instance = fixture.componentInstance;
  });

  it('should emit toggleSelectedUser when selectUserToggle has been called', () => {
    instance.user = { ...generateMockAutoShareUser(), IsSelected: true};
    spyOn(instance.toggleSelectedUser, 'emit');

    instance.selectUserToggle(instance.user);

    expect(instance.toggleSelectedUser.emit).toHaveBeenCalledWith({...instance.user, IsSelected: false});
  });
});
