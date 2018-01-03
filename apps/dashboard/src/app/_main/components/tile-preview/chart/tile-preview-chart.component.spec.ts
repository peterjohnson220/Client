import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TilePreviewChartComponent } from './tile-preview-chart.component';
import { generateMockTilePreviewChart } from '../../../models';

describe('Tile Preview Chart', () => {
  let fixture: ComponentFixture<TilePreviewChartComponent>;
  let instance: TilePreviewChartComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TilePreviewChartComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TilePreviewChartComponent);
    instance = fixture.componentInstance;
  });

  it('should show chart label', () => {
    instance.chartLabel = 'test chart label';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set chartComponentData on chartBackButtonClick()', () => {

    const categoryName = 'test category';
    const categoryValue = 55;

    instance.chartComponentData = [generateMockTilePreviewChart(categoryName, categoryValue)];
    instance.loadChartDetail(categoryName);
    instance.chartBackButtonClick();

    expect(instance.chartComponentData[0].CategoryName).toMatch(categoryName);
    expect(instance.chartComponentData[0].CategoryValue.toString()).toMatch(categoryValue.toString());
  });

  it('should load chart detail data on loadChartDetail()', () => {

    const categoryName = 'test category';
    const detailKey = 'test detail key';
    const detailValue = 55;

    instance.chartComponentData = [generateMockTilePreviewChart(categoryName, 0, detailKey, detailValue)];
    instance.loadChartDetail(categoryName);

    expect(instance.chartComponentData[0].CategoryName).toMatch(detailKey);
    expect(instance.chartComponentData[0].CategoryValue.toString()).toMatch(detailValue.toString());
  });
});
