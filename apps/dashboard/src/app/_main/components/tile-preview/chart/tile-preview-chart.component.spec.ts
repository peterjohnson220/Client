import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TilePreviewChartComponent } from './tile-preview-chart.component';
import { generateMockTilePreviewChartData } from '../../../models';

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
    instance.model = {
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ChartComponentData: undefined};
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set chartComponentData on chartBackButtonClick()', () => {

    const categoryName = 'test category';
    const categoryValue = 55;
    const chartComponentData = [generateMockTilePreviewChartData(categoryName, categoryValue)];
    instance.model = {
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ChartComponentData: chartComponentData
    };
    instance.loadChartDetail(categoryName);
    instance.chartBackButtonClick();

    expect(instance.model.ChartComponentData[0].CategoryName).toMatch(categoryName);
    expect(instance.model.ChartComponentData[0].CategoryValue.toString()).toMatch(categoryValue.toString());
  });

  it('should load chart detail data on loadChartDetail()', () => {

    const categoryName = 'test category';
    const detailKey = 'test detail key';
    const detailValue = 55;
    const chartComponentData = [generateMockTilePreviewChartData(categoryName, 0, detailKey, detailValue)];
    instance.model = {
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ChartComponentData: chartComponentData
    };
    instance.loadChartDetail(categoryName);

    expect(instance.model.ChartComponentData[0].CategoryName).toMatch(detailKey);
    expect(instance.model.ChartComponentData[0].CategoryValue.toString()).toMatch(detailValue.toString());
  });

  it('should not show kendo chart when model.ChartComponentData.length = 0', () => {

    instance.model = {
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ChartComponentData: []};
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show kendo chart when model.ChartComponentData.length > 0', () => {

    const categoryName = 'test category';
    const detailKey = 'test detail key';
    const detailValue = 55;
    const chartComponentData = [generateMockTilePreviewChartData(categoryName, 0, detailKey, detailValue)];

    instance.model = {
      ChartType: 'test',
      ChartLabel: 'test chart label',
      ChartComponentData: chartComponentData
    };
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });



});
