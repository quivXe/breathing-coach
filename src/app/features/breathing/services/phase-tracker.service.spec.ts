import { TestBed } from '@angular/core/testing';

import { PhaseTrackerService } from './phase-tracker.service';

describe('PhaseTrackerService', () => {
  let service: PhaseTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
