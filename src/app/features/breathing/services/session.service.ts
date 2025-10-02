import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { BreathConfigStore } from './breath-config.service';
import { interval, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  protected readonly store = inject(BreathConfigStore);

  readonly isRunning = signal<boolean>(false);
  readonly isFinished = signal<boolean>(false);
  readonly elapsedTime = signal<number>(0);

  private readonly TIME_DELTA_IN_SECONDS = 0.1;
  private stop$ = new Subject<void>();

  start(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.isFinished.set(false);

    interval(this.TIME_DELTA_IN_SECONDS * 1000)
      .pipe(takeUntil(this.stop$))
      .subscribe(() => {
        this.incrementElapsedTime();

        if (this.elapsedTime() >= this.store.sessionDuration()) {
          this.finalizeElapsedTime();
          this.stop();
        }
      });
  }

  stop(): void {
    this.stop$.next();
    this.isFinished.set(true);
  }

  reset(): void {
    this.stop();
    this.elapsedTime.set(0);
    this.isFinished.set(false);
    this.isRunning.set(false);
  }
  
  private incrementElapsedTime(): void {
    this.elapsedTime.update(v => v += this.TIME_DELTA_IN_SECONDS);
  }
  private finalizeElapsedTime(): void {
    this.elapsedTime.set(this.store.sessionDuration());
  }
}
