import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mention-badge',
  templateUrl: './mention-badge.component.html',
  styleUrls: ['./mention-badge.component.scss']
})
export class MentionBadgeComponent {
  @Input() content = '';
  @Output() deleteBtnIsClicked = new EventEmitter<void>();

  onDeleteBtnIsClicked(): void {
    this.deleteBtnIsClicked.emit();
  }
}
