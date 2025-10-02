import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { PhasesModalComponent } from './phases-modal.component';
import { BreathConfigStore } from '../../features/breathing/services/breath-config.service';
import { vi, describe, it, expect } from 'vitest';
import "@testing-library/jest-dom/vitest"

class MockBreathConfigStore {
  private phases = {
    INHALE: { duration: 4 },
    HOLD: { duration: 2 },
    EXHALE: { duration: 6 },
  };

  getPhase(name: keyof typeof this.phases) {
    return this.phases[name];
  };

  updatePhaseDuration = vi.fn();
}

describe('PhasesModalComponent', () => {
  let store: MockBreathConfigStore;
  let comp: PhasesModalComponent;

  beforeEach(async () => {
    store = new MockBreathConfigStore();
    vi.clearAllMocks();
  });

  it('should render', async () => {
    const { fixture } = await render(PhasesModalComponent, {
      providers: [{ provide: BreathConfigStore, useValue: store }],
    });
    comp = fixture.componentInstance;

    expect(screen.getByText('Adjust phase durations')).toBeInTheDocument();
    expect(screen.getByText('Inhale')).toBeInTheDocument();
    expect(screen.getByText('Hold')).toBeInTheDocument();
    expect(screen.getByText('Exhale')).toBeInTheDocument();
  });

  it('should reset signals on showModal', async () => {
    vi.spyOn(store, 'getPhase').mockImplementation((name: any) => {
      if (name === 'INHALE') return { duration: 10 };
      if (name === 'HOLD') return { duration: 5 };
      if (name === 'EXHALE') return { duration: 8 };
      throw new Error('unknown phase');
    });

    const { fixture } = await render(PhasesModalComponent, {
      providers: [{ provide: BreathConfigStore, useValue: store }],
    });
    comp = fixture.componentInstance;

    const updateSpy = vi.spyOn(store, 'updatePhaseDuration')

    waitFor(() => {
      comp.showModal();
    })
    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(updateSpy).toHaveBeenCalledWith("INHALE", 10);
    expect(updateSpy).toHaveBeenCalledWith("HOLD", 5);
    expect(updateSpy).toHaveBeenCalledWith("EXHALE", 8);
  });

  it('should call updatePhaseDuration with signal values when saving', async () => {
    const { fixture } = await render(PhasesModalComponent, {
      providers: [{ provide: BreathConfigStore, useValue: store }],
    });
    comp = fixture.componentInstance;
    

    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(store.updatePhaseDuration).toHaveBeenCalledWith('HOLD', 2);
    expect(store.updatePhaseDuration).toHaveBeenCalledWith('INHALE', 4);
    expect(store.updatePhaseDuration).toHaveBeenCalledWith('EXHALE', 6);
  });

  it('should save via UI click', async () => {
    const { fixture } = await render(PhasesModalComponent, {
      providers: [{ provide: BreathConfigStore, useValue: store }],
    });
    comp = fixture.componentInstance;

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(store.updatePhaseDuration).toHaveBeenCalledTimes(3);
  });
});
