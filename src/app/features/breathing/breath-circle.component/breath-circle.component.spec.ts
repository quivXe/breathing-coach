import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreathCircleComponent } from './breath-circle.component';

describe('BreathCircleComponent', () => {
  let component: BreathCircleComponent;
  let fixture: ComponentFixture<BreathCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreathCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreathCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
