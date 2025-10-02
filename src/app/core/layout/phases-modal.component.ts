import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { BreathConfigStore } from '../../features/breathing/services/breath-config.service';
import { FormsModule } from '@angular/forms';
import { Info, LucideAngularModule } from 'lucide-angular';
import { BreathingComponent } from '../../features/breathing/breathing.component';

@Component({
  selector: 'app-phases-modal',
  imports: [FormsModule, LucideAngularModule],
  template: `
    <dialog id="settings-modal" class="modal" #dialog>
        <div class="modal-box">
          <div class="join items-center gap-4 justify-center relative w-full">
              <h3 class="text-lg font-bold">Adjust phase durations</h3>
              <div
                class="tooltip tooltip-bottom tooltip-info absolute right-0 top-1/2 translate-y-[-50%] z-1"
                data-tip="Choose how long (in seconds) each phase should last."
              >
                <lucide-angular [name]="infoIcon" [size]="16" />
              </div>
          </div>
          <div class="card py-3 gap-0.5">
              <label class="text-center font-semibold">Inhale</label>
            <div class="join gap-2 items-center mb-1 w-full">
              <input class="range grow" type="range" [(ngModel)]="inhaleDuration" min="1" max="20">
              <label class="text-lg font-semibold w-9 text-center">{{inhaleDuration()}} s</label>
            </div>
              <label class="text-center font-semibold">Hold</label>
            <div class="join gap-2 items-center mb-1 w-full">
              <input class="range grow" type="range" [(ngModel)]="holdDuration" min="1" max="20">
              <label class="text-lg font-semibold w-9 text-center">{{holdDuration()}} s</label>
            </div>
              <label class="text-center font-semibold">Exhale</label>
            <div class="join gap-2 items-center mb-1 w-full">
              <input class="range grow" type="range" [(ngModel)]="exhaleDuration" min="1" max="20">
              <label class="text-lg font-semibold w-9 text-center">{{exhaleDuration()}} s</label>
            </div>
          </div>
          <div class="modal-action">
              <form method="dialog" class="flex gap-3">
                  <button class="btn btn-secondary">Close</button>
                  <button class="btn btn-primary" (click)="save()">Save</button>
              </form>
          </div>
        </div>
    </dialog>
  `,
  styles: `
    .tooltip::before {
      transform: translateX(-95%) translateY(var(--tt-pos, -0.25rem)) !important;
      transition: all 0.1s ease;
    }
    .tooltip::after {
      transition: all 0.1s ease;
    }
  `
})
export class PhasesModalComponent {
  @ViewChild('dialog') readonly dialog!: ElementRef<HTMLDialogElement>;

  private readonly store = inject(BreathConfigStore)
  // private readonly breathingComponent = inject(BreathingComponent);

  protected readonly infoIcon = Info;

  protected readonly inhaleDuration = signal<number>(this.store.getPhase('INHALE').duration);
  protected readonly holdDuration = signal<number>(this.store.getPhase('HOLD').duration);
  protected readonly exhaleDuration = signal<number>(this.store.getPhase('EXHALE').duration);

  showModal() {
    this.inhaleDuration.set(this.store.getPhase('INHALE').duration);
    this.holdDuration.set(this.store.getPhase('HOLD').duration);
    this.exhaleDuration.set(this.store.getPhase('EXHALE').duration);
    this.dialog.nativeElement.showModal();
  }
  protected save() {
    this.store.updatePhaseDuration('HOLD', this.holdDuration());
    this.store.updatePhaseDuration('INHALE', this.inhaleDuration());
    this.store.updatePhaseDuration('EXHALE', this.exhaleDuration());

    // this.breathingComponent.stop();
  }
}
