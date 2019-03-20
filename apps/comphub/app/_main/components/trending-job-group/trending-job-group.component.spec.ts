import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowRef } from 'libs/core/services';

import { TrendingJobGroupComponent } from './trending-job-group.component';
import { generateMockTrendingJobGroup } from '../../models';

describe('Comphub - Main - Trending Job Group', () => {
  let instance: TrendingJobGroupComponent;
  let fixture: ComponentFixture<TrendingJobGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingJobGroupComponent ],
      providers: [
        {
          provide: WindowRef,
          useValue: {
            nativeWindow: {
                getSelection: () => 'Highlighted Text'
              }
            }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TrendingJobGroupComponent);
    instance = fixture.componentInstance;

    instance.trendingJobGroup = generateMockTrendingJobGroup();
    fixture.detectChanges();
  });

  it('should NOT emit a trendingJobClicked event when handling a trending job click, and there is selected text', () => {
    spyOn(instance.trendingJobClicked, 'emit');

    instance.handleTrendingJobClicked('Accountant');

    expect(instance.trendingJobClicked.emit).not.toHaveBeenCalled();
  });


  it('should NOT emit a trendingJobClicked event when handling a trending job click, and the group is disabled', () => {
    spyOn(instance.trendingJobClicked, 'emit');
    instance.disabled = true;

    instance.handleTrendingJobClicked('Accountant');

    expect(instance.trendingJobClicked.emit).not.toHaveBeenCalled();
  });

  it('should emit a trendingJobClicked event when handling a trending job click, and there is no selected text', () => {
    instance.winRef = {
      nativeWindow: {
        getSelection: () => ''
      }
    };
    spyOn(instance.trendingJobClicked, 'emit');

    instance.handleTrendingJobClicked('Accountant');

    expect(instance.trendingJobClicked.emit).toHaveBeenCalled();
  });

});
