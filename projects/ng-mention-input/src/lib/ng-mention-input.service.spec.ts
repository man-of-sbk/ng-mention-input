import { TestBed } from '@angular/core/testing';

import { NgMentionInputService } from './ng-mention-input.service';

describe('NgMentionInputService', () => {
  let service: NgMentionInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgMentionInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
