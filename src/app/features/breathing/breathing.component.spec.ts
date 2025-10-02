// breathing.component.spec.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { BreathingComponent } from './breathing.component';
import { PhaseTrackerService } from './services/phase-tracker.service';
import { SessionService } from './services/session.service';
import { PhaseName } from './services/breath-config.service';
import { signal } from '@angular/core';

const createPhaseTrackerMock = (running = false, phaseName: PhaseName = "INHALE") => ({
  start: vi.fn(),
  stop: vi.fn(),
  isRunning: vi.fn(() => running),
  phaseName: signal(phaseName)
});
const createSessionServiceMock = (running = false, finished = false) => ({
  start: vi.fn(),
  stop: vi.fn(),
  reset: vi.fn(),
  isRunning: vi.fn(() => running),
  isFinished: vi.fn(() => finished),
  elapsedTime: vi.fn(() => 1)
})

describe('BreathingComponent', () => {
  it('shows Start and Stop buttons', async () => {
    await render(BreathingComponent, {
      providers: [
        { provide: PhaseTrackerService, useValue: createPhaseTrackerMock() },
        { provide: SessionService, useValue: createSessionServiceMock() }
      ],
    });

    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('Stop')).toBeDefined();
  });

  it('calls start() when Start button is clicked', async () => {
    const phaseTracker = createPhaseTrackerMock(false);

    await render(BreathingComponent, {
      providers: [
        { provide: PhaseTrackerService, useValue: phaseTracker },
        { provide: SessionService, useValue: createSessionServiceMock() }
      ],
    });

    const btn = screen.getByText('Start');
    fireEvent.click(btn);

    expect(phaseTracker.start).toHaveBeenCalled();
  });

  it('calls stop() when Stop button is clicked', async () => {

    const phaseTracker = createPhaseTrackerMock(true);
    const sessionService = createSessionServiceMock(true);
    await render(BreathingComponent, {
      providers: [
        { provide: PhaseTrackerService, useValue: phaseTracker },
        { provide: SessionService, useValue: sessionService }
      ],
    });

    const btn = screen.getByText('Stop');
    fireEvent.click(btn);

    expect(phaseTracker.stop).toHaveBeenCalled();
    expect(sessionService.reset).toHaveBeenCalled();
  });
  it("phase name in template changes when phaseName() signal changes", async () => {
    const phaseTracker = createPhaseTrackerMock(true, "INHALE");
    await render(BreathingComponent, {
      providers: [
        { provide: PhaseTrackerService, useValue: phaseTracker },
        { provide: SessionService, useValue: createSessionServiceMock() }
      ],
    });

    waitFor(() => {
      expect(screen.getByText("INHALE")).toBeInTheDocument();
    })
    phaseTracker.phaseName.set("HOLD");
    waitFor(() => {
      expect(screen.getByText("HOLD")).toBeInTheDocument();
    })

  })
});
