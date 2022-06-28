import { Component, Inject, OnInit } from '@angular/core';

import  myAppConfig  from '../../config/my-app-config'




// noinspection TypeScriptValidateTypes
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor() {

    // @ts-ignore

  }

  ngOnInit(): void {

  }
}
