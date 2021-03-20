import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMentionInputComponent } from './ng-mention-input.component';

describe('NgMentionInputComponent', () => {
  let component: NgMentionInputComponent;
  let fixture: ComponentFixture<NgMentionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgMentionInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgMentionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
