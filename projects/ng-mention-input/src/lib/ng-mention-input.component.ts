import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

export interface ValidatorErrors {
  required?: any;
  teacherNameNotFound?: any;
}

@Component({
  selector: 'ng-mention-input',
  templateUrl: './ng-mention-input.component.html',
  styleUrls: ['./ng-mention-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef((): any => NgMentionInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef((): any => NgMentionInputComponent),
      multi: true
    }
  ]
})
export class NgMentionInputComponent implements ControlValueAccessor, OnChanges, OnInit, Validator, OnDestroy {  
  @Input() mentionList: any[] = [];
  @Input() mentionInputValue$!: Observable<string>;
  @Input() areMentionItemsObjects = false;
  @Input() displayedValueQuery = '';
  @Input() retrievedValueQuery = '';
  @Input() deleteByRetrievedValueQuery = true;
  @Input() value: any[] = [];
  @Input() sortByQuery = '';

  @Output() mentionItemIsClicked = new EventEmitter<any>();

  filteredMentionList: any[] = [];
  _mentionlist: any[] = [];
  shouldMentionListBeDisplayed = false;
  selectedItems: string[] = [];
  inputSize = 1;
  mentionInputValue = '';
  isUserTyping = false;

  private mentionInputValueSubscription!: Subscription;

  @ViewChild('mentionInputRef') mentionInputRef!: ElementRef;

  // controlValueAccessor set up properies
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.value && this.value) {
      this.onInputValueIsChanged();
    }
  }

  ngOnInit(): void {
    this.filteredMentionList = [...this.mentionList];
    this.onMentionInputValueChanged();
  }

  ngOnDestroy() {
    if (this.mentionInputValueSubscription) {
      this.mentionInputValueSubscription.unsubscribe();
    }
  }

  private onMentionInputValueChanged(): void {
    if (!this.mentionInputValue$) {
      return;
    }

    this.mentionInputValueSubscription = this.mentionInputValue$.subscribe((value: string): void => {
      this.mentionInputValue = value;
      this.handleOnInputIsChanged(value);
    });
  }

  private onInputValueIsChanged(): void {
    if (this.areMentionItemsObjects) {
      this.selectedItems = this.value.filter((valueItem: any): boolean => {
        return this.mentionList.find((mentionItem: any): boolean => {
          return mentionItem[this.displayedValueQuery] === valueItem[this.displayedValueQuery];
        });
      });
    } else {
      this.selectedItems = this.value.filter((valueItem: any): boolean => {
        return this.mentionList.find(function(mentionItem: any): boolean {
          return mentionItem === valueItem;
        });
      });
    }
  }

  onInputIsChanged(e: Event): void {
    this.handleOnInputIsChanged((e.target as HTMLInputElement).value);
  }

  handleOnInputIsChanged(inputVal: string): void {
    if (!inputVal) {
      this.shouldMentionListBeDisplayed = false;
      this._mentionlist = [];
    } else {
      this.inputSize = inputVal.length;
      const processedInputVal = inputVal.toLowerCase().trim();

      if (this.areMentionItemsObjects) {
        this._mentionlist = this.filteredMentionList.filter((mentionItem: any): boolean => {
          return mentionItem[this.displayedValueQuery].toLowerCase().includes(processedInputVal);
        });
      } else {
        this._mentionlist = this.filteredMentionList.filter((mentionItem: any): boolean => {
          return mentionItem.toLowerCase().includes(processedInputVal);
        });
      }

      if (!this._mentionlist.length) {
        if (this.shouldMentionListBeDisplayed) {
          this.shouldMentionListBeDisplayed = false;
        }
      } else if (!this.shouldMentionListBeDisplayed) {
        this.shouldMentionListBeDisplayed = true;
      }
    }

    this.notifyChangesToValueAccessor(true);
  }

  getMentionItemContent(mentionItem: any): any {
    return this.areMentionItemsObjects ? mentionItem[this.displayedValueQuery] : mentionItem;
  }

  onMentionItemIsClicked(mentionItem: any): void {
    this.mentionItemIsSelected(mentionItem);
  }

  private mentionItemIsSelected(mentionItem: any): void {
    this.mentionItemIsClicked.emit(mentionItem);
    this.selectedItems.push(mentionItem);
    this.filteredMentionList = this.removeItemFromMentionList(this.filteredMentionList, mentionItem);
    this.resetMentionInputStates();
    this.notifyChangesToValueAccessor();
  }

  private resetMentionInputStates(): void {
    this.shouldMentionListBeDisplayed = false;
    this.mentionInputValue = '';
    this.inputSize = 1;
  }

  private notifyChangesToValueAccessor(isUserTyping = false): void {
    // always put the following line before the execution of the onChagne method
    this.isUserTyping = isUserTyping;
    this.onChange(this.selectedItems);
    this.onTouched();
  }

  onInputIsKeyedDown(e: { keyCode: number }): void {
    switch (e.keyCode) {
      // enter btn
      case 13:
        if (!this._mentionlist.length) {
          break;
        }

        this.mentionItemIsSelected(this._mentionlist[0]);
        break;

      // escape btn
      case 27:
        this._mentionlist = [];
        this.resetMentionInputStates();
        break;

      // backspace btn
      case 8:
        if (this.mentionInputValue !== '' || !this.selectedItems.length) {
          break;
        }

        this.filteredMentionList.push(this.selectedItems.pop());
        this.notifyChangesToValueAccessor();
        break;
      default:
        break;
    }
  }

  onInputContainerIsClicked(): void {
    this.mentionInputRef.nativeElement.focus();
  }

  // controlValueAccessor & validators set up methods
  writeValue(newControlledValue: any): void {
    this.value = newControlledValue;
    this.onInputValueIsChanged();
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  validate({ value }: FormControl): ValidationErrors | null {
    const errors: ValidatorErrors = {};
    if (
      (this.isUserTyping && !value.length && !this.mentionInputValue) ||
      (!this.isUserTyping && !value.length)
    ) {
      errors.required = true;
    }

    if (this.mentionInputValue && !this._mentionlist.length ||
      (this.mentionInputValue && this._mentionlist.length && this._mentionlist.every(
        (mention: any): boolean => mention[this.displayedValueQuery] !== this.mentionInputValue
      ))
    ) {
      errors.teacherNameNotFound = true;
    }

    return errors;
  }
  // end

  onMentionItemDeleteBtnIsClicked(selectedMentionItem: any): void {
    this.selectedItems = this.removeItemFromMentionList(this.selectedItems, selectedMentionItem);
    this.filteredMentionList.push(selectedMentionItem);
    this.notifyChangesToValueAccessor();
  }

  private removeItemFromMentionList(arr: any[], beingRemovedItem: any): any[] {
    if (this.areMentionItemsObjects) {
      const comparingQuery = this.deleteByRetrievedValueQuery ? this.retrievedValueQuery : this.displayedValueQuery;

      return arr.filter((mentionItem: any): boolean => {
        return mentionItem[comparingQuery] !== beingRemovedItem[comparingQuery];
      });
    }

    return arr.filter((mentionItem: any): boolean => {
      return mentionItem !== beingRemovedItem;
    });
  }
}
