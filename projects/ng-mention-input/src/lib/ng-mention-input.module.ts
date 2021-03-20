import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionBadgeComponent } from './components/mention-badge/mention-badge.component';
import { NgMentionInputComponent } from './ng-mention-input.component';

@NgModule({
  declarations: [
    NgMentionInputComponent,
    MentionBadgeComponent
  ],
  imports: [
    FormsModule
  ],
  exports: [NgMentionInputComponent]
})
export class NgMentionInputModule { }
