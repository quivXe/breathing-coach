// breathing.component.spec.ts
import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { BreathingComponent } from './breathing.component';
import { PhaseTrackerService } from './services/phase-tracker.service';

const createPhaseTrackerMock = (running = false) => ({
  start: vi.fn(),
  stop: vi.fn(),
  isRunning: vi.fn(() => running),
  phaseName: vi.fn()
});

describe('BreathingComponent', () => {
  it('shows Start and Stop buttons', async () => {
    await render(BreathingComponent, {
      providers: [{ provide: PhaseTrackerService, useValue: createPhaseTrackerMock() }],
    });

    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('Stop')).toBeDefined();
  });

  it('calls start() when Start button is clicked', async () => {
    const phaseTracker = createPhaseTrackerMock(false);

    await render(BreathingComponent, {
      providers: [{ provide: PhaseTrackerService, useValue: phaseTracker }],
    });

    const btn = screen.getByText('Start');
    fireEvent.click(btn);

    expect(phaseTracker.start).toHaveBeenCalled();
  });

  it('calls stop() when Stop button is clicked', async () => {
    const phaseTracker = createPhaseTrackerMock(true);

    await render(BreathingComponent, {
      providers: [{ provide: PhaseTrackerService, useValue: phaseTracker }],
    });

    const btn = screen.getByText('Stop');
    fireEvent.click(btn);

    expect(phaseTracker.stop).toHaveBeenCalled();
  });
});
