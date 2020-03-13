import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import {
  generateMockChartTile, generateMockIconTile, generateMockListTile, generateMockIconTileWithPayload,
  generateTilePreviewIconFromTile
} from '../../models';
import { StringReplacePipe } from 'libs/core/pipes';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { TileComponent } from './tile.component';

describe('Tile', () => {
  let fixture: ComponentFixture<TileComponent>;
  let instance: TileComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        TileComponent,
        StringReplacePipe
      ],
      providers: [SettingsService],
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
    const tilePreviewIcon = generateTilePreviewIconFromTile(instance.tile);
    expect(tilePreviewIcon.ContainsDetailData).toEqual(false);
    expect(tilePreviewIcon.faIconClass.join(' ')).toEqual(instance.tile.IconClass);
    expect(tilePreviewIcon.IconSize).toEqual('10x');
    expect(tilePreviewIcon.CssClassName).toEqual('preview-tile-icon');
  });

  it('generatePreviewModelForIcon should generate properly with payload', () => {
    instance.tile = generateMockIconTileWithPayload();
    fixture.detectChanges();
    const tilePreviewIconWithPayload = generateTilePreviewIconFromTile(instance.tile);
    expect(tilePreviewIconWithPayload.ContainsDetailData).toEqual(true);
    expect(tilePreviewIconWithPayload.faIconClass.join(' ')).toEqual(instance.tile.IconClass);
    expect(tilePreviewIconWithPayload.IconSize).toEqual('4x');
    expect(tilePreviewIconWithPayload.CssClassName).toEqual('preview-tile-icon-small');
    expect(tilePreviewIconWithPayload.Title).toEqual(instance.tile.TilePreviewData[0].Title);
    expect(tilePreviewIconWithPayload.SubTitle).toEqual(instance.tile.TilePreviewData[0].SubTitle);
    expect(tilePreviewIconWithPayload.DetailData).toEqual(instance.tile.TilePreviewData[0].DetailData);
  });

  it('should show tile preview list when that type is given', () => {
    instance.tile = generateMockListTile(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
