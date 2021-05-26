import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

import { StringEditorComponent } from './string-editor.component';

describe('StringEditorComponent', () => {
  let component: StringEditorComponent;
  let fixture: ComponentFixture<StringEditorComponent>;
  let abstractFeatureFlagService: AbstractFeatureFlagService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StringEditorComponent],
      providers: [
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringEditorComponent);
    component = fixture.componentInstance;
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow editing when disabled', () => {
    component.inEditMode = false;
    const createNewLink = fixture.debugElement.nativeElement.querySelector('span');
    createNewLink.click();
    expect(component.isInEditState).toBeFalsy();
  });

  it('should allow editing when enabled', () => {
    component.inEditMode = true;
    expect(component.isInEditState).toBeFalsy();
    const createNewLink = fixture.debugElement.nativeElement.querySelector('.editable');
    createNewLink.click();
    expect(component.isInEditState).toBeTruthy();
  });

  it('should not show radial text counter when showRadialTextCounter is false', () => {
    // arrange
    component.inEditMode = true;
    component.totalRewardsRadialTextCountersFeatureFlag.value = true;
    const createNewLink = fixture.debugElement.nativeElement.querySelector('.editable');
    createNewLink.click();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.radial-text-counter')).toBeFalsy();
  });

  it('should not show radial text counter when feature flag is false', () => {
    // arrange
    component.inEditMode = true;
    component.showRadialTextCounter = true;
    component.totalRewardsRadialTextCountersFeatureFlag.value = false;
    const editLink = fixture.debugElement.nativeElement.querySelector('.editable');
    editLink.click();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.radial-text-counter')).toBeFalsy();
  });

  it('should show radial text counter when both showRadialTextCounter and feature flag true', () => {
    // arrange
    component.isEditable = true;
    component.showRadialTextCounter = true;
    component.totalRewardsRadialTextCountersFeatureFlag.value = true;
    const editLink = fixture.debugElement.nativeElement.querySelector('.editable');
    editLink.click();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.radial-text-counter')).toBeTruthy();
  });
});
