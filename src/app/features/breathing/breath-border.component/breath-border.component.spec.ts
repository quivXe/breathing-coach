import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreathBorderComponent } from './breath-border.component';

describe('BreathBorderComponent', () => {
  let component: BreathBorderComponent;
  let fixture: ComponentFixture<BreathBorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreathBorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreathBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
