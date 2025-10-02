import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { gsap } from "gsap";
import { PhaseTrackerService } from '../services/phase-tracker.service';
import { BreathConfigStore } from '../services/breath-config.service';

@Component({
  selector: 'app-breath-circle',
  template: `<div #circle class="absolute inset-3 aspect-square rounded-2xl bg-primary m-0 z-[-20]"></div>`
})
export class BreathCircleComponent {
  @ViewChild("circle") private readonly circleEl!: ElementRef<HTMLElement>
  private readonly phaseTracker = inject(PhaseTrackerService);
  private readonly breathConfigStore = inject(BreathConfigStore);

  private readonly insetFrom = "2rem";
  private readonly insetTo = "0.9rem";
  private readonly radiusFrom = "50%";
  private readonly radiusTo = "2%";

  inhaleAnimation(): gsap.core.Tween {
    const { duration, delay } = this.breathConfigStore.getPhase('INHALE');
    return gsap.fromTo(
      this.circleEl.nativeElement, { borderRadius: this.radiusFrom, inset: this.insetFrom }, {
      inset: this.insetTo,
      borderRadius: this.radiusTo,
      duration,
      delay,
      ease: "none",
      onComplete: () => this.phaseTracker.nextPhase()
    })
  }
  exhaleAnimation(): gsap.core.Tween {
    const { duration, delay } = this.breathConfigStore.getPhase('EXHALE');
    return gsap.to(
      this.circleEl.nativeElement, { 
      borderRadius: this.radiusFrom,
      inset: this.insetFrom,
      duration,
      delay,
      ease: "none",
      onComplete: () => this.phaseTracker.nextPhase()
    })
  }
  expandAnimationInstant(): gsap.core.Tween {
    return gsap.to(
      this.circleEl.nativeElement, {
      inset: 0,
      duration: 0 
    })
  }
}
