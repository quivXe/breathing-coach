import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header.component';
import { PhasesModalComponent } from './core/layout/phases-modal.component';
import { SidebarInfoComponent } from './features/info/sidebar-info.component/sidebar-info.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, PhasesModalComponent, SidebarInfoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
