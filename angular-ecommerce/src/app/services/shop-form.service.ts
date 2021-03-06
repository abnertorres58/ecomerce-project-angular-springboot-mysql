import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {State} from "../common/state";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = environment.fredsshopApiUrl + '/countries';
  private statesUrl = environment.fredsshopApiUrl + '/states';


  constructor(private httpClient: HttpClient) { }

  // Method to get countries
  getCountries(): Observable<Country[]> {

    // Returns an observable
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  // Get States
  getStates(theCountryCode: string): Observable<State[]> {

    //  Search Url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

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

interface GetResponseCountries {
  //Unwraps the JSON from Spring Data REST _embedded entry
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  //Unwraps the JSON from Spring Data REST _embedded entry
  _embedded: {
    states: State[];
  }
}
