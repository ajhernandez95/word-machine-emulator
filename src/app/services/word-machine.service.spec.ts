import { TestBed } from '@angular/core/testing';

import { WordMachineService } from './word-machine.service';

describe('WordMachineService', () => {
  let service: WordMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
