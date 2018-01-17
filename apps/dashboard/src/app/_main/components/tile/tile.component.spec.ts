import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TileComponent } from './tile.component';
import { generateMockChartTile, generateMockIconTile, generateMockListTile, generateMockIconTileWithPayload } from '../../models';

describe('Tile', () => {
  let fixture: ComponentFixture<TileComponent>;
  let instance: TileComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TileComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TileComponent);
    instance = fixture.componentInstance;
  });

  it('should show tile preview chart when that type is given', () => {
    instance.tile = generateMockChartTile();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show tile preview icon when that type is given', () => {
    instance.tile = generateMockIconTile();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('generatePreviewModelForIcon should generate properly with no payload', () => {
    instance.tile = generateMockIconTile();
    fixture.detectChanges();
    const tilePreviewIcon = TileComponent.generatePreviewModelForIcon(instance.tile);
    expect(tilePreviewIcon.ContainsPayLoad).toEqual(false);
    expect(tilePreviewIcon.IconClass).toEqual(instance.tile.IconClass);
    expect(tilePreviewIcon.IconSize).toEqual('fa-10x');
    expect(tilePreviewIcon.CssClassName).toEqual('preview-tile-icon');
  });

  it('generatePreviewModelForIcon should generate properly with payload', () => {
    instance.tile = generateMockIconTileWithPayload();
    fixture.detectChanges();
    const tilePreviewIconWithPayload = TileComponent.generatePreviewModelForIcon(instance.tile);
    expect(tilePreviewIconWithPayload.ContainsPayLoad).toEqual(true);
    expect(tilePreviewIconWithPayload.IconClass).toEqual(instance.tile.IconClass);
    expect(tilePreviewIconWithPayload.IconSize).toEqual('fa-4x');
    expect(tilePreviewIconWithPayload.CssClassName).toEqual('preview-tile-icon-small');
    expect(tilePreviewIconWithPayload.Title).toEqual(instance.tile.TilePreviewData[0].Title);
    expect(tilePreviewIconWithPayload.SubTitle).toEqual(instance.tile.TilePreviewData[0].SubTitle);
    expect(tilePreviewIconWithPayload.DetailData).toEqual(instance.tile.TilePreviewData[0].DetailData);
  });

  it('should show tile preview list when that type is given', () => {
    instance.tile = generateMockListTile();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
