import { Component, ChangeDetectionStrategy, signal, computed, effect, ViewChild, ElementRef, inject } from '@angular/core';
import { gsap } from "gsap";
import { PhaseTrackerService } from './services/phase-tracker.service';
import { BreathBorderComponent } from './breath-border.component/breath-border.component';
import { BreathCircleComponent } from './breath-circle.component/breath-circle.component';

@Component({
  selector: 'app-breathing',
  templateUrl: './breathing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreathBorderComponent, BreathCircleComponent]
})
export class BreathingComponent {
  @ViewChild(BreathCircleComponent) private readonly circleComp!: BreathCircleComponent;
  @ViewChild(BreathBorderComponent) private readonly borderComp!: BreathBorderComponent;
  
  // @ViewChild("paragraph") private readonly paragraph!: ElementRef<SVGPathElement>

  protected phaseTracker = inject(PhaseTrackerService);
  private animationTimeline = gsap.timeline({ repeat: -1, paused: true });

  toggle() {
    if (this.phaseTracker.isRunning()) { this.stop() }
    else { this.start() }
  }
  start() {
    this.phaseTracker.start();
    this.animationTimeline.play();
  }
  stop() {
    this.phaseTracker.stop();
    this.animationTimeline.restart();
    this.animationTimeline.pause();
  }
  ngAfterViewInit() {

    this.animationTimeline
      .add(this.circleComp.inhaleAnimation())
      .add(this.borderComp.holdAnimation())
      .add(this.circleComp.expandAnimationInstant())
      .add(this.borderComp.clearAnimationInstant())
      .add(this.circleComp.exhaleAnimation())

    // this.breathTimeline
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "inhaling+=0.5")
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "holding")
    //   .fromTo(this.paragraph.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, "exhaling")
    
  }
  ngOnDestroy() {
    this.animationTimeline.kill();
  }
}
