import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TilePreviewListComponent } from './tile-preview-list.component';
import {
  generateMockIconTileWithPayload, generateMockListTile,
  generateTilePreviewListFromTile,
  TilePreviewIcon
} from '../../../models';
import { TruncateAfterPipe } from 'libs/core/pipes';


describe('TilePreviewIcon', () => {
  let fixture: ComponentFixture<TilePreviewListComponent>;
  let instance: TilePreviewListComponent;

  // Configure testing module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TilePreviewListComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TilePreviewListComponent);
    instance = fixture.componentInstance;
  });

  it('should show data when data is given', () => {
    const tile = generateMockListTile();
    instance.model = generateTilePreviewListFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
