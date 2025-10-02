import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from "@ngrx/signals"

export type PhaseName = 'INHALE' | 'EXHALE' | 'HOLD';
export type PhaseConfig = {
  name: PhaseName,
  duration: number,
  delay?: number,
}

export type BreathConfig = {
  phases: PhaseConfig[]
  sessionDuration: number // in seconds
}

export const DEFAULT_BREATH_CONFIG: BreathConfig = {
  phases: [
    { name: 'INHALE', duration: 4, delay: .2 },
    { name: 'HOLD', duration: 4, delay: .5 },
    { name: 'EXHALE', duration: 8, delay: .2 },
  ],
  sessionDuration: 60
}

export const BreathConfigStore = signalStore(
  { providedIn: 'root' },
  withState(DEFAULT_BREATH_CONFIG),
  withComputed(({ sessionDuration }) => ({
    minutes: computed(() => Math.floor(sessionDuration() / 60)),
    seconds: computed(() => sessionDuration() % 60)
  })),
  withMethods((store) => ({
    updateSessionDuration(newDuration: number): void {
      if (newDuration < 0 || newDuration > 600) return; // throw new Error(); TODO: handle that
      patchState(store, { sessionDuration: newDuration })
    },
    updatePhaseDuration(phaseName: PhaseName, duration: PhaseConfig['duration']): void {
      patchState(store, (state) => ({
        phases: state.phases.map(phase => phase.name === phaseName ? {...phase, duration} : phase)
      }))
    },
    getPhase(name: PhaseName): PhaseConfig {
      return store.phases().find(e => e.name === name)!
    }
  }))

)
