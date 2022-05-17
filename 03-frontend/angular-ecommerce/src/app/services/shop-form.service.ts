import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Month" dropdown list
    // - start at current month and loop until
    for(let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // The "of" operator from rxjs, will wrap an object as an Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Year" downlist list - start at the current year and loop for the next 10
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
