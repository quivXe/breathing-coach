import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar-info',
  imports: [],
  templateUrl: './sidebar-info.component.html'
})
export class SidebarInfoComponent {
  protected readonly isOpen = signal(false);

  // Track if we are in desktop mode (>1100px)
  protected readonly isDesktop = signal(true);

  protected panelClasses = signal({
  'fixed top-[60px] right-0 h-4/5 w-[360px] transform transition-transform duration-300 ease-in-out': this.isDesktop(),
  'translate-x-full': this.isDesktop() && !this.isOpen(),
  'mt-6 block': !this.isDesktop(),
  'bg-base-200 shadow-2xl shadow-base-300 rounded-xl p-6 overflow-y-auto': true
});

  ngOnInit() {
    this.checkScreenWidth();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    console.log(window.innerWidth);
    this.isDesktop.set(window.innerWidth > 1100);
  }
}