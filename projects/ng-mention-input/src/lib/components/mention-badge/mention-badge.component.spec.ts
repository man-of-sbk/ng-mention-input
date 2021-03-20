import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionBadgeComponent } from './mention-badge.component';

describe('MentionBadgeComponent', () => {
  let component: MentionBadgeComponent;
  let fixture: ComponentFixture<MentionBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentionBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
