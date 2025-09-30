import { Injectable, signal } from '@angular/core';

export type PhaseName = 'INHALE' | 'EXHALE' | 'HOLD' | 'RELAX';
export type Phase = {
  name: PhaseName,
  duration: number,
  delay?: number,
}
export type BreathConfig = {
  phases: Phase[],
  sessionDuration: number // in seconds
}

export const DEFAULT_BREATH_CONFIG: BreathConfig = {
  phases: [
    { name: 'INHALE', duration: 4, delay: .2 },
    { name: 'HOLD', duration: 4, delay: .5 },
    { name: 'EXHALE', duration: 8, delay: .2 }
  ],
  sessionDuration: 60
}

@Injectable({
  providedIn: 'root'
})
export class BreathConfigService {
  readonly config = signal<BreathConfig>(DEFAULT_BREATH_CONFIG);
  
  update(newConfig: Partial<BreathConfig>): void {
    this.config.update(c => ({ ...c, ...newConfig }));
  }
  getPhase(name: Exclude<PhaseName, 'RELAX'>): Phase {
    return this.config().phases.find(e => e.name === name)!;
  }
}
