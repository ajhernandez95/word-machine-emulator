import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WordMachineService } from 'src/app/services/word-machine.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  results: number[] = [];
  errors: string[] = [];

  constructor(
    private wordMachineService: WordMachineService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.wordMachineService.resultsArray.subscribe(arr => {
      this.results = arr
    }));
    this.subs.push(this.wordMachineService.errorStringArray.subscribe(arr => this.errors = arr));
  }

  ngOnDestroy() {
    let sub = this.subs.pop();
    while (sub) {
      sub.unsubscribe();
      sub = this.subs.pop();
    }
  }

}
