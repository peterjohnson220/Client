import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewStatementBannerComponent } from './create-new-statement-banner.component';

describe('CreateNewStatementBannerComponent', () => {
  let component: CreateNewStatementBannerComponent;
  let fixture: ComponentFixture<CreateNewStatementBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewStatementBannerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewStatementBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the link is clicked', () => {
    spyOn(component.createNewClicked, 'emit');

    const createNewLink = fixture.debugElement.nativeElement.querySelector('h5 a');
    createNewLink.click();

    expect(component.createNewClicked.emit).toHaveBeenCalled();
  });
});
