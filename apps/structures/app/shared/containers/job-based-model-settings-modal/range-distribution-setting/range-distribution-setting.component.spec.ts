import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';

import { RangeDistributionSettingComponent } from './range-distribution-setting.component';

describe('RangeDistributionTypeComponent', () => {
  let component: RangeDistributionSettingComponent;
  let fixture: ComponentFixture<RangeDistributionSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeDistributionSettingComponent ],
      providers: [
        provideMockStore({}),
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(true) }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDistributionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
