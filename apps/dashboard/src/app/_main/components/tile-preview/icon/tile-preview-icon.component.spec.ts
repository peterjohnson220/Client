import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TilePreviewIconComponent } from './tile-preview-icon.component';
import {
  generateMockIconTile, generateMockIconTileWithPayload, generateTilePreviewIconFromTile,
  TilePreviewIcon
} from '../../../models';
import { TruncateAfterPipe } from 'libs/common/core/pipes';

describe('TilePreviewIcon', () => {
  let fixture: ComponentFixture<TilePreviewIconComponent>;
  let instance: TilePreviewIconComponent;

  // Configure testing module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TilePreviewIconComponent,
        TruncateAfterPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TilePreviewIconComponent);
    instance = fixture.componentInstance;
  });

  it('should show just icon and when no payload is given', () => {
    const tile = generateMockIconTile();
    instance.model = generateTilePreviewIconFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show more than just an icon and when a payload is given', () => {
    const tile = generateMockIconTileWithPayload();
    instance.model = generateTilePreviewIconFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

