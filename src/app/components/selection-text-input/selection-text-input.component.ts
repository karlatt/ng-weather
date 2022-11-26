import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryData } from "../../data";
import { getProperty } from '../../shared';

@Component({
  selector: 'app-selection-text-input',
  templateUrl: './selection-text-input.component.html',
  styleUrls: ['./selection-text-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionTextInputComponent), // component is not existing on registration so we lazily initialize it
      multi: true,
    },
  ],
})
export class SelectionTextInputComponent implements ControlValueAccessor {
  @Input() public internalInputClass!:string;
  @Input() public placeholder!:string;
  @Input() public itemLabel!: string;
  @Input() public itemPropertyValue!: string;
  @Input() public itemsList: Array<CountryData> = [];// can be more generic with any or unknown

  @Output() public applyFilter: EventEmitter<string> = new EventEmitter<string>();

  public internalInputValue: string | null = null;
  public currentValue = null;
  public showList = false;

  private onChange: (_: any) => void = () => void 0;
  private onTouched: () => void = () => void 0;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  public writeValue(value: any) {
    let valueFromList = null;
    if (value) {
      valueFromList = this.itemsList.find(
        (item) => getProperty(item, this.itemPropertyValue) === value
      );
    }
    this.setCurrentValue(valueFromList);
    this.cdRef.markForCheck();
  }

  public onBlur() {
    this.onTouched();
    this.showList = false;
  }

  public onFocus() {
    this.showList = true;
  }

  public onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (this.currentValue) { //here we want to test all falsy values
      this.setCurrentValue(null);
      this.onChange(null);
    }
    this.internalInputValue = value;
    this.applyFilter.emit(value);
  }

  public selectValue(value: CountryData) {
    this.setCurrentValue(value);
    this.onChange(getProperty(value, this.itemPropertyValue));//code
    this.applyFilter.emit();
  }

  private setCurrentValue(value: CountryData) {
    this.currentValue = value;
    this.internalInputValue = getProperty(value, this.itemLabel);//name
  }
}
