import { TestBed } from '@angular/core/testing';

import { BreathConfigService } from './breath-config.service';

describe('BreathConfigService', () => {
  let service: BreathConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreathConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
