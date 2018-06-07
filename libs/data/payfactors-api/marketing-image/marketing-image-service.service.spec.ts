import { TestBed, inject } from '@angular/core/testing';

import { MarketingImageService } from './marketing-image-service.service';

describe('MarketingImageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketingImageService]
    });
  });

  it('should be created', inject([MarketingImageService], (service: MarketingImageService) => {
    expect(service).toBeTruthy();
  }));
});
