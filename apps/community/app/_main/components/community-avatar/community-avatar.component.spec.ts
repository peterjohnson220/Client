import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CommunityAvatarComponent } from './community-avatar.component';

describe('CommunityAvatarComponent', () => {
  let fixture: ComponentFixture<CommunityAvatarComponent>;
  let instance: CommunityAvatarComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CommunityAvatarComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityAvatarComponent);
    instance = fixture.componentInstance;
  });

  it('should show avatar component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display reply-size avatar if IsReply === true ', () => {
    instance.IsReply = true;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display post-size avatar if IsReply === false ', () => {
    instance.IsReply = false;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display default avatar if AvatarSource === default_user.png', () => {
    instance.AvatarSource = 'default_user.png';

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});
