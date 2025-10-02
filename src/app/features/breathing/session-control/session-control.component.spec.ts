import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { SessionControlComponent } from './session-control.component';
import { BreathConfigStore } from '../services/breath-config.service';
import { SessionService } from '../services/session.service';
import { signal } from '@angular/core';
import { vi, describe, it, beforeEach } from 'vitest'; 
import "@testing-library/jest-dom/vitest"

describe('SessionControlComponent', () => {
  let mockStore: { 
    sessionDuration: ReturnType<typeof signal<number>>; 
    updateSessionDuration: (val: number) => void,
    getPhase: (name: string) => any
  };
  let mockSession: {
    isRunning: ReturnType<typeof signal<boolean>>;
    elapsedTime: ReturnType<typeof signal<number>>;
  };

  beforeEach(async () => {
    mockStore = {
      sessionDuration: signal(120), // 2 minutes
      updateSessionDuration: vi.fn(),
      getPhase: vi.fn(name => ( {name: name, duration: 4, delay: .2} ))
    };

    mockSession = {
      isRunning: signal(false),
      elapsedTime: signal(0)
    };

    await render(SessionControlComponent, {
      providers: [
        { provide: BreathConfigStore, useValue: mockStore },
        { provide: SessionService, useValue: mockSession }
      ]
    });
  });

  it('should render slider when session is not running and not render progressbar', () => {
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  it('should render progresbar when session is running and not slider', async () => {
    mockSession.isRunning.set(true);
    waitFor(() => {
      expect(screen.getByRole('slider')).not.toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    })
  })

  it('should call updateSessionDuration when slider changes', async () => {
    const slider = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.input(slider, { target: { value: '200' } });
    expect(mockStore.updateSessionDuration).toHaveBeenCalledWith(200);
  });

  it('should show correct initial countdown', () => {
    expect(screen.getByText('2')).toBeInTheDocument(); // minutes
    expect(screen.getByText('0')).toBeInTheDocument(); // seconds
  });

  it('should show progress and countdown when session is running', async () => {
    mockSession.isRunning.set(true);
    mockSession.elapsedTime.set(60); // 1 minute elapsed

    // re-render updates signals
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();

    // Countdown should be 1 minute left (120 - 60 = 60s)
    expect(screen.getByText('1')).toBeInTheDocument(); // minutes
    expect(screen.getByText('0')).toBeInTheDocument(); // seconds
  });

  it('should update progress value', async () => {
    mockSession.isRunning.set(true);
    mockSession.elapsedTime.set(60); // half time
    const progress = await screen.findByRole('progressbar') as HTMLProgressElement;
    expect(progress.value).toBeCloseTo(0.5, 1);
  });
});
