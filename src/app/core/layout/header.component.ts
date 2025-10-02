import { Component, output } from '@angular/core';
import { LucideAngularModule, SlidersHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  template: `
    <header class="navbar">
      <h1 class="grow text-3xl font-bold">Breathing Coach</h1>
      <button (click)="settingsOpened.emit()">
        <lucide-angular [name]="SlidersIcon" />
      </button>
  </header>
  `
})
export class HeaderComponent {
  protected readonly SlidersIcon = SlidersHorizontal;
  readonly settingsOpened = output<void>();
}
