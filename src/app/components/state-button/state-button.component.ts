import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { timer } from "rxjs";
import { finalize } from "rxjs/operators";

const REINIT_AFTER: number = 1000;

@Component({
  selector: "app-state-button",
  template: `<button
    [class]="zeClass"
    [disabled]="!isInInitialState || disabled"
    (click)="triggerAction()"
  >
    <ng-container *ngTemplateOutlet="zeTemplate"> </ng-container>
  </button>`,
})
export class StateButtonComponent {
  @Input()
  public loading = false;
  @Input() public initialTemplate!: TemplateRef<unknown>;
  @Input() public initialClass!: string;
  @Input() public loadingTemplate!: TemplateRef<unknown>;
  @Input() public loadingClass!: string;
  @Input() public completeTemplate!: TemplateRef<unknown>;
  @Input() public completeClass!: string;
  @Input() public disabled = false;
  @Input() public reinitAfter!: number;

  isInInitialState = true;

  @Output("clicked")
  private readonly onClick: EventEmitter<void> = new EventEmitter<void>();
  public get zeTemplate(): TemplateRef<unknown> {
    if (this.isInInitialState) return this.initialTemplate;
    if (this.loading) return this.loadingTemplate;
    return this.completeTemplate;
  }
  public get zeClass(): string {
    if (this.isInInitialState) return this.initialClass;
    if (this.loading) return this.loadingClass;
    return this.completeClass;
  }

  public triggerAction() {
    this.isInInitialState = false;
    this.onClick.emit();
    timer(this.reinitAfter)
      .pipe(finalize(() => (this.isInInitialState = true)))
      .subscribe();
   
  }
}
