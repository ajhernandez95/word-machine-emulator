import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WordMachineService } from 'src/app/services/word-machine.service';

@Component({
  selector: 'app-word-input',
  templateUrl: './word-input.component.html',
  styleUrls: ['./word-input.component.scss']
})
export class WordInputComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  operationsArray: string[] = []
  operations: string = '';

  constructor(
    private wordMachineService: WordMachineService
  ) { }

  ngOnInit(): void {
    this.wordMachineService.setOperationArray(["23 DUP 4 POP 5 DUP + DUP + -", "5 6 + -"])

    this.subs.push(this.wordMachineService.operationArray.subscribe(arr => this.operationsArray = arr))
  }

  processOperations() {
    const operationsArray = this.operations ? this.operations.split(',') : []

    this.wordMachineService.processArray(operationsArray);
  }

  ngOnDestroy() {
    let sub = this.subs.pop();
    while (sub) {
      sub.unsubscribe();
      sub = this.subs.pop();
    }
  }

}
