import { Component, ChangeDetectionStrategy, signal, computed, effect, ViewChild, ElementRef, inject, Inject } from '@angular/core';
import { gsap } from "gsap";
import { PhaseTrackerService } from './services/phase-tracker.service';
import { BreathBorderComponent } from './breath-border/breath-border.component';
import { BreathCircleComponent } from './breath-circle/breath-circle.component';
import { SessionControlComponent } from "./session-control/session-control.component";
import { SessionService } from './services/session.service';
import { BreathConfigStore } from './services/breath-config.service';

@Component({
  selector: 'app-breathing',
  templateUrl: './breathing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreathBorderComponent, BreathCircleComponent, SessionControlComponent],
  providers: [{
    provide: 'BreathTimeline',
    useFactory: () => gsap.timeline({ repeat: -1, paused: true })
  }]
})
export class BreathingComponent {
  @ViewChild(BreathCircleComponent) private readonly circleComp!: BreathCircleComponent;
  @ViewChild(BreathBorderComponent) private readonly borderComp!: BreathBorderComponent;
  
  // @ViewChild("paragraph") private readonly paragraph!: ElementRef<SVGPathElement>

  protected phaseTracker = inject(PhaseTrackerService);
  protected sessionService = inject(SessionService);
  protected breathConfigStore = inject(BreathConfigStore);

  private isAfterInit = false;
  
  constructor(@Inject('BreathTimeline') private readonly animationTimeline: gsap.core.Timeline) {
    effect(() => {
      this.breathConfigStore.phases();
      this.stop();
      if (this.isAfterInit) this.rebuildAnimationTimeline();
    })
  }

  toggle() {
    this.sessionService.isRunning() ? this.stop() : this.start();
  }
  start() {
    this.phaseTracker.start();
    this.sessionService.start();
    this.animationTimeline.play();
  }
  stop() {
    this.phaseTracker.stop();
    this.sessionService.reset();
    this.animationTimeline.restart();
    this.animationTimeline.pause();
  }
  ngAfterViewInit() {
    this.isAfterInit = true;
    this.rebuildAnimationTimeline();

    // this.breathTimeline
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "inhaling+=0.5")
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "holding")
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "exhaling")
    
  }
  ngOnDestroy() {
    this.animationTimeline.kill();
  }
  private rebuildAnimationTimeline() {
    this.animationTimeline.clear();
    this.animationTimeline
      .add(this.circleComp.inhaleAnimation())
      .add(this.borderComp.holdAnimation())
      .add(this.circleComp.expandAnimationInstant())
      .add(this.borderComp.clearAnimationInstant())
      .add(this.circleComp.exhaleAnimation())
      .call(() => {
        if (this.sessionService.isFinished() || !this.sessionService.isRunning()) {
          this.stop();
        }
      })
  }
}
