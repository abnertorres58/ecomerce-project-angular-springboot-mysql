import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ShopValidators} from "../../validators/shop-validators";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // @ts-ignore
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [ Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', [ Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [  Validators.required,
                                                              Validators.minLength(2),
                                                            ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [     Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [    Validators.required]),
        country: new FormControl('', [  Validators.required]),
        zipCode: new FormControl('', [  Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

  //  Populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  //  Populate credit card Years
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

  //  Populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  // @ts-ignore
  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      console.log(event);
      // @ts-ignore
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //  Bug fix for states
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      // @ts-ignore
      this.checkoutFormGroup.controls.billingAddress.reset();

      //  Bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    // @ts-ignore
    console.log(this.checkoutFormGroup.get('customer').value);
    // @ts-ignore
    console.log("The mail address is " + this.checkoutFormGroup.get('customer').value.email);

    // @ts-ignore
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);

    // @ts-ignore
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }


  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    // Read the selected year from the form
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // If the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear) {
      // Get the current month
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // Get the credit card months
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    // @ts-ignore
    const countryCode = formGroup.value.country.code;

    // @ts-ignore
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

      //  Select first Item by default
        // @ts-ignore
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}
