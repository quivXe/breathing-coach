import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PhaseTrackerService } from '../services/phase-tracker.service';
import gsap from 'gsap';
import { BreathConfigService } from '../services/breath-config.service';

@Component({
  selector: 'app-breath-border',
  imports: [],
  template: `
    <svg viewBox="0 0 100 100" class="absolute w-full h-full top-0 left-0  z-[-10]">
      <path
        #path
        class="stroke-6 stroke-primary"
        d="M48 2
          H96
          q2,0 2,2
          V96
          q0,2 -2,2
          H4
          q-2,0 -2,-2
          V4
          q0,-2 2,-2
          H48
        "
        fill="none"
        stroke-dasharray="400"
        stroke-dashoffset="400"
      />
    </svg>
  `
})
export class BreathBorderComponent {
  @ViewChild("path") private readonly pathEl!: ElementRef<SVGElement>
  private readonly phaseTracker = inject(PhaseTrackerService);
  private readonly breathConfig = inject(BreathConfigService);

  holdAnimation(): gsap.core.Tween {
    const { duration, delay } = this.breathConfig.getPhase('HOLD');
    return gsap.fromTo(
      this.pathEl.nativeElement, { drawSVG: '0' }, {
      drawSVG: '100%', 
      duration,
      delay,
      ease: "sine.out",
      onComplete: () => this.phaseTracker.nextPhase()
    })
  }
  clearAnimationInstant(): gsap.core.Tween {
    return gsap.to(
      this.pathEl.nativeElement, { 
      drawSVG: 0, 
      duration: 0 
    })
  }
}
