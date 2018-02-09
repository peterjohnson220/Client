import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TilePreviewListComponent } from './tile-preview-list.component';
import {
  generateMockIconTileWithPayload, generateMockListTile,
  generateTilePreviewListFromTile,
  TilePreviewIcon
} from '../../../models';
import { TruncateAfterPipe } from 'libs/core/pipes';


describe('TilePreviewList', () => {
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

  it('should show data with columns when data is given and showColumnHeadings is true', () => {
    const tile = generateMockListTile(true);
    instance.model = generateTilePreviewListFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show data without columns when data is given and showColumnHeadings is false', () => {
    const tile = generateMockListTile(false);
    instance.model = generateTilePreviewListFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not display main button when main button url is blank', () => {
    const tile = generateMockListTile(false, '');
    instance.model = generateTilePreviewListFromTile(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
