import { computed, inject, Injectable, signal } from '@angular/core';
import { BreathConfigService, Phase, PhaseName } from './breath-config.service';

@Injectable({ providedIn: 'root' })
export class PhaseTrackerService {
  private readonly breathConfig = inject(BreathConfigService);
  private iterator = this.phaseGenerator();

  readonly phase = signal<Phase | null>(null);
  readonly phaseName = computed<PhaseName>(() => this.phase() ? this.phase()!.name : 'RELAX');
  readonly isRunning = computed<Boolean>(() => this.phase() !== null);

  private *phaseGenerator(): Generator<Phase> {
    while (true) for (let phase of this.breathConfig.config().phases) yield phase;
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
