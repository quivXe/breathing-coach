import { Component, computed, inject, signal } from '@angular/core';
import { BreathConfigStore } from '../services/breath-config.service';
import { FormsModule } from "@angular/forms"
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-session-control',
  imports: [FormsModule],
  template: `
  <div class="join items-center w-full h-10">

    <div
      class="swap w-full join-item items-center justify-stretch"
      [class.swap-active]="sessionService.isRunning()"
    >
      @if (!sessionService.isRunning()) {
        <input 
        class="swap-off w-full range"
        type="range"
        min="10"
        max="600"
        step="10" 
        (input)="updateDuration($event)"
        [value]="store.sessionDuration()">
      }
      @else {
        <progress
          class="swap-on progress progress-primary w-full"
          [value]="remainingPercentage()" 
          max="1"
        ></progress>
      }
      </div>

    <label 
      class="join-item flex gap-0.5 justify-center countdown w-1/3 text-center text-2xl"
      [class.no-transition]="!sessionService.isRunning()"
    >
      <span [style.--value]="minutes()" aria-live="polite" [attr.aria-label]="minutes()">{{minutes()}}</span>
      :
      <span [style.--value]="seconds()" aria-live="polite" [attr.aria-label]="seconds()">{{seconds()}}</span>
    </label>

  </div>
  <div class="text-2xl font-bold">{{store.getPhase('INHALE').duration}} {{store.getPhase('HOLD').duration}} {{store.getPhase('EXHALE').duration}}
    <br>{{store.getPhase('INHALE').delay}} {{store.getPhase('HOLD').delay}} {{store.getPhase('EXHALE').delay}}
  </div>
  `,
  styles: `
  .no-transition > ::before {
    transition: none !important;
  }
  .displayNone {
    display: none !important;
  }
  `
})
export class SessionControlComponent {
  protected readonly store = inject(BreathConfigStore);
  protected readonly sessionService = inject(SessionService);

  protected minutes = computed<number>(() => this.toMinutes(this.store.sessionDuration() - this.sessionService.elapsedTime()));
  protected seconds = computed<number>(() => this.toSeconds(this.store.sessionDuration() - this.sessionService.elapsedTime()))
  protected remainingPercentage = computed<number>(
    () => this.toReversedPercentage(this.sessionService.elapsedTime(), this.store.sessionDuration())
  )

  updateDuration(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    this.store.updateSessionDuration(value);
  }

  private toMinutes(val: number): number {
    return Math.floor(val / 60);
  }
  private toSeconds(val: number): number {
    return Math.floor(val) % 60;
  }
  private toReversedPercentage(value: number, total: number) {
    return (total-value) / total;
  }
}
