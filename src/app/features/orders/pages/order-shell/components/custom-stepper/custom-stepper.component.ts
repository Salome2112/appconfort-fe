import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepItem {
  label: string;
  key: string;
  badge?: string;
  badgeSeverity?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-stepper.component.html',
  styleUrl: './custom-stepper.component.css'
})
export class CustomStepperComponent {
  steps = input.required<StepItem[]>();
  activeIndex = model<number>(0);

  selectStep(index: number): void {
    this.activeIndex.set(index);
  }
}
