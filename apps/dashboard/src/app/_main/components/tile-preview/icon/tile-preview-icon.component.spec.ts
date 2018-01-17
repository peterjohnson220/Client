import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TileComponent } from '../../tile';
import { TilePreviewIconComponent } from './tile-preview-icon.component';
import {  generateMockIconTile, generateMockIconTileWithPayload,  TilePreviewIcon } from '../../../models';
import { TruncateAfterPipe } from 'libs/shared/pipes';


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
    instance.model = TileComponent.generatePreviewModelForIcon(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show more than just an icon and when a payload is given', () => {
    const tile = generateMockIconTileWithPayload();
    instance.model = TileComponent.generatePreviewModelForIcon(tile);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

