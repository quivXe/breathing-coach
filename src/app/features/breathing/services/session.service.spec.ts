import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { BreathConfigStore } from './breath-config.service';
import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest';

const SESSION_DURATION = 5; // 5 seconds
// mock store with a fixed session duration
class MockBreathConfigStore {
  sessionDuration = vi.fn().mockReturnValue(SESSION_DURATION); 
}

describe('SessionService (vitest)', () => {
  let service: SessionService;
  let store: MockBreathConfigStore;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        SessionService,
        { provide: BreathConfigStore, useClass: MockBreathConfigStore }
      ]
    });

    service = TestBed.inject(SessionService);
    store = TestBed.inject(BreathConfigStore) as unknown as MockBreathConfigStore;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts and increments elapsedTim', () => {
    service.start();

    expect(service.isRunning()).toBe(true);
    expect(service.isFinished()).toBe(false);
    expect(service.elapsedTime()).toBe(0);

    vi.advanceTimersByTime(100); // 0.1s
    expect(service.elapsedTime()).toBeCloseTo(0.1, 0.3);

    vi.advanceTimersByTime(900); // total 1s
    expect(service.elapsedTime()).toBeCloseTo(1, 0.3);
  });

  it('stops when reaching sessionDuration', () => {
    service.start();

    vi.advanceTimersByTime(6000); // run for 6s
    expect(service.elapsedTime()).toBe(SESSION_DURATION); // should stop on session duration 
    expect(service.isFinished()).toBe(true);
    expect(service.isRunning()).toBe(true); // should still run, reset is not called
  });

  it('can stop manually', () => {
    service.start();
    vi.advanceTimersByTime(1000);

    service.stop();
    const time = service.elapsedTime();

    vi.advanceTimersByTime(2000); // should not advance anymore
    expect(service.elapsedTime()).toBe(time);
    expect(service.isFinished()).toBe(true);
  });

  it('resets everything', () => {
    service.start();
    vi.advanceTimersByTime(2000);

    service.reset();
    expect(service.elapsedTime()).toBe(0);
    expect(service.isFinished()).toBe(false);
    expect(service.isRunning()).toBe(false);
  });

  it('ignores multiple start calls', () => {
    service.start();
    const idBefore = (service as any).intervalId;

    service.start(); // should be ignored
    const idAfter = (service as any).intervalId;

    expect(idBefore).toBe(idAfter);
  });
});
