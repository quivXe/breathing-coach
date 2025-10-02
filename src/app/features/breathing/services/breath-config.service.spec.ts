import { describe, it, expect, beforeEach } from 'vitest';
import { BreathConfigStore, DEFAULT_BREATH_CONFIG, PhaseName } from './breath-config.service';
import { TestBed } from '@angular/core/testing';

describe('BreathConfigStore', () => {
  let store: InstanceType<typeof BreathConfigStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreathConfigStore]
    });
    store = TestBed.inject(BreathConfigStore);
  });

  it('should have default values', () => {
    expect(store.sessionDuration()).toBe(DEFAULT_BREATH_CONFIG.sessionDuration);
    expect(store.phases().length).toBe(DEFAULT_BREATH_CONFIG.phases.length);
    expect(store.minutes()).toBe(Math.floor(DEFAULT_BREATH_CONFIG.sessionDuration / 60));
    expect(store.seconds()).toBe(DEFAULT_BREATH_CONFIG.sessionDuration % 60);
  });

  it('should update sessionDuration correctly', () => {
    store.updateSessionDuration(120);
    expect(store.sessionDuration()).toBe(120);
    expect(store.minutes()).toBe(2);
    expect(store.seconds()).toBe(0);
  });

  it('should ignore invalid sessionDuration values', () => {
    const original = store.sessionDuration();
    store.updateSessionDuration(-5);
    expect(store.sessionDuration()).toBe(original);

    store.updateSessionDuration(1000);
    expect(store.sessionDuration()).toBe(original);
  });

  it('should return correct phase by name', () => {
    const inhale = store.getPhase('INHALE');
    expect(inhale.name).toBe('INHALE');

    const hold = store.getPhase('HOLD');
    expect(hold.name).toBe('HOLD');

    const exhale = store.getPhase('EXHALE');
    expect(exhale.name).toBe('EXHALE');
  });

  it('minutes and seconds computed values should reflect sessionDuration', () => {
    store.updateSessionDuration(125); // 2min 5s
    expect(store.minutes()).toBe(2);
    expect(store.seconds()).toBe(5);

    store.updateSessionDuration(59); // <1min
    expect(store.minutes()).toBe(0);
    expect(store.seconds()).toBe(59);
  });
});
