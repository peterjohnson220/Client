import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommunityTabComponent } from './community-tab.component';

describe('CommunityTabComponent', () => {
  let fixture: ComponentFixture<CommunityTabComponent>;
  let instance: CommunityTabComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunityTabComponent
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityTabComponent);
    instance = fixture.componentInstance;
  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
