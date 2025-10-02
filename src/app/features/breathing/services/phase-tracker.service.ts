import { computed, inject, Injectable, signal } from '@angular/core';
import { BreathConfigStore, PhaseConfig, PhaseName } from './breath-config.service';

@Injectable({ providedIn: 'root' })
export class PhaseTrackerService {
  private readonly breathConfigStore = inject(BreathConfigStore);
  private iterator = this.phaseGenerator();

  readonly phase = signal<PhaseConfig | null>(null);
  readonly phaseName = computed<PhaseName | 'RELAX'>(() => this.phase() ? this.phase()!.name : 'RELAX');

  private *phaseGenerator(): Generator<PhaseConfig> {
    while (true) for (let phase of this.breathConfigStore.phases()) yield phase;
  }

  nextPhase() {
    const next = this.iterator.next().value;
    this.phase.set(next);
  }

  start() {
    this.nextPhase();
  }

  stop() {
    this.iterator = this.phaseGenerator();
    this.phase.set(null);
  }
}
