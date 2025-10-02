import { TestBed } from '@angular/core/testing';
import { PhaseTrackerService } from './phase-tracker.service';
import { BreathConfigStore, PhaseConfig, PhaseName } from './breath-config.service';
import { SessionService } from './session.service';
import { vi, describe, beforeEach, expect, it } from 'vitest';

// Mock BreathConfigStore
class MockBreathConfigStore {
  phases(): PhaseConfig[] {
    return [
      { name: 'INHALE', duration: 4 },
      { name: 'HOLD', duration: 4 },
      { name: 'EXHALE', duration: 8 },
    ]
  }
}

// Mock SessionService (unused in this service but injected)
class MockSessionService {}

describe('PhaseTrackerService', () => {
  let service: PhaseTrackerService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhaseTrackerService,
        { provide: BreathConfigStore, useClass: MockBreathConfigStore },
        { provide: SessionService, useClass: MockSessionService }
      ]
    });
    service = TestBed.inject(PhaseTrackerService);
  });

  it('should have default state', () => {
    expect(service.phase()).toBeNull();
    expect(service.phaseName()).toBe('RELAX');
  });

  it('nextPhase should return the first phase', () => {
    service.nextPhase();
    expect(service.phase()!.name).toBe('INHALE');
    expect(service.phaseName()).toBe('INHALE');
  });

  it('start should initialize the first phase', () => {
    service.start();
    expect(service.phase()!.name).toBe('INHALE');
    expect(service.phaseName()).toBe('INHALE');
  });

  it('nextPhase should cycle through all phases', () => {
    service.start();
    expect(service.phaseName()).toBe('INHALE');

    service.nextPhase();
    expect(service.phaseName()).toBe('HOLD');

    service.nextPhase();
    expect(service.phaseName()).toBe('EXHALE');

    service.nextPhase();
    expect(service.phaseName()).toBe('INHALE'); // loops back
  });

  it('stop should reset phase to null', () => {
    service.start();
    expect(service.phase()).not.toBeNull();

    service.stop();
    expect(service.phase()).toBeNull();
    expect(service.phaseName()).toBe('RELAX');

    // nextPhase after stop starts over
    service.nextPhase();
    expect(service.phaseName()).toBe('INHALE');
  });
});
