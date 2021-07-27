import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordMachineService {
  public operationArray: Subject<string[]> = new Subject();
  public resultsArray: Subject<number[]> = new Subject();
  public errorString: Subject<string> = new Subject();

  results = [];
  error: string = '';



  constructor() { }

  public setOperationArray(operationInput: string[]) {
    this.operationArray.next(operationInput)
  }

  public processArray(stringArray) {
    this.clearState();
    const solutions = [];

    if (stringArray.length == 0) {
      this.errorString.next('Operations are blank | please enter operations above')
      return;
    }

    for (const i1 in stringArray) {
      let splitStr = stringArray[i1].trim().split(' ');
      splitStr = splitStr.filter(function (str) {
        return /\S/.test(str);
      });

      let errorFound = false;

      for (const i2 in splitStr) {
        if (parseInt(splitStr[i2])) {
          this.results.push(splitStr[i2])
        } else {
          switch (splitStr[i2].toLowerCase()) {
            case 'pop':
              if (!this.handlePop()) errorFound = true;
              break;
            case 'dup':
              if (!this.handleDup()) errorFound = true;
              break;
            case '+':
              if (!this.handleArithmetic('+')) errorFound = true;
              break;
            case '-':
              if (!this.handleArithmetic('-')) errorFound = true;
              break;
            default:
              this.error = `String ${splitStr[i2]} is not a supported operation`;
              errorFound = true;
          }
        }

        if (errorFound) {
          this.errorString.next(this.error + ` from ${splitStr.join(' ')}`);
          break
        };
      }
      if (errorFound) break;

      solutions.push(this.results.slice(-1)[0])
      this.results = [];
      this.error = '';
    }

    this.resultsArray.next(solutions)
  }

  private handlePop() {
    const value = this.results.pop();
    if (value == undefined) {
      this.error = 'No number was available to POP'
      return false;
    };

    return true;
  }

  private handleDup() {
    const value = this.results.slice(-1)[0]

    if (value == undefined) {
      this.error = 'No number was available to DUP';
      return false;
    }

    this.results.push(value)
    return true;
  }

  private handleArithmetic(arithmetic: string) {
    const values = this.results.splice(-2);

    if (values[0] == undefined || values[1] == undefined) {
      this.error = `Not enough numbers to ${arithmetic == '+' ? 'add' : 'subtract'}`;
      return false;
    } else if (!parseInt(values[0]) || !parseInt(values[1])) {
      this.error = 'Both values need to be numbers';
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
    this.errorString.next('');
    this.resultsArray.next([]);
    this.operationArray.next([]);
  }
}
