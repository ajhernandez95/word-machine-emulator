import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordMachineService {
  public operationArray: Subject<string[]> = new Subject();
  public resultsArray: Subject<number[]> = new Subject();
  public errorStringArray: Subject<string[]> = new Subject();

  results = [];
  errors: string[] = [];



  constructor() { }

  public setOperationArray(operationInput: string[]) {
    this.operationArray.next(operationInput)
  }

  public processArray(stringArray) {
    this.clearState();
    const solutions = [];

    if (stringArray.length == 0) {
      this.errorStringArray.next(['Operations are blank | please enter operations above'])
      return;
    }

    for (const i1 in stringArray) {
      let splitStr = stringArray[i1].trim().split(' ');
      splitStr = splitStr.filter(function (str) {
        return /\S/.test(str);
      });

      let errorFound = false;

      for (const i2 in splitStr) {
        if (/^\d+$/.test(splitStr[i2])) {
          this.results.push(splitStr[i2])
        } else {
          switch (splitStr[i2].toLowerCase()) {
            case 'pop':
              if (!this.handlePop(splitStr.join(' '))) errorFound = true;
              break;
            case 'dup':
              if (!this.handleDup(splitStr.join(' '))) errorFound = true;
              break;
            case '+':
              if (!this.handleArithmetic('+', splitStr.join(' '))) errorFound = true;
              break;
            case '-':
              if (!this.handleArithmetic('-', splitStr.join(' '))) errorFound = true;
              break;
            default:
              this.errors.push(`String ${splitStr[i2]} is not a supported operation`);
              errorFound = true;
          }
        }
      }

      if (!errorFound) {
        if (this.results.slice(-1)[0] != undefined) {
          solutions.push(`${this.results.slice(-1)[0]} from ${stringArray[i1]}`)
        } else {
          solutions.push('empty')
        }
      }

      this.results = [];
    }

    this.errorStringArray.next(this.errors)
    this.resultsArray.next(solutions)
  }

  private handlePop(splitStr) {
    const value = this.results.pop();
    if (value == undefined) {
      this.errors.push(`No number was available to POP from ${splitStr}`);
      return false;
    };

    return true;
  }

  private handleDup(splitStr) {
    const value = this.results.slice(-1)[0]

    if (value == undefined) {
      this.errors.push(`No number was available to DUP from ${splitStr}`);
      return false;
    }

    this.results.push(value)
    return true;
  }

  private handleArithmetic(arithmetic: string, splitStr) {
    const values = this.results.splice(-2);

    if (values[0] == undefined || values[1] == undefined) {
      this.errors.push(`Not enough numbers to ${arithmetic == '+' ? 'add' : 'subtract'} from ${splitStr}`);
      return false;
    } else if (!/^\d+$/.test(values[0]) || !/^\d+$/.test(values[1])) {
      this.errors.push(`Both values need to be numbers from ${splitStr}`);
      return false;
    } else {
      if (arithmetic == '+') {
        this.results.push(parseInt(values[0]) + parseInt(values[1]));
      } else if (arithmetic == '-') {
        this.results.push(parseInt(values[0]) - parseInt(values[1]));
      }
    }

    return true;
  }

  clearState() {
    this.errors = [];
    this.results = [];
    this.errorStringArray.next([]);
    this.resultsArray.next([]);
    this.operationArray.next([]);
  }
}
