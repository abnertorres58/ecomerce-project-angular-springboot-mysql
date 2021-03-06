import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ShopValidators} from "../../validators/shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";

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

  storage: Storage = sessionStorage;

  // Initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    // Setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    // Read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [ Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', [ Validators.required,
                                                              Validators.minLength(2),
                                                              ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail,
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
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [    Validators.required]),
        nameOnCard: new FormControl('', [  Validators.required,
                                                                Validators.minLength(2),
                                                                ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [  Validators.required,
                                                                Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required,
                                                                Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      */
      })
    });

    /*
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
    */

  //  Populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }


  private reviewCartDetails() {

  //  Subscribe to cartService.totalQuantity
   this.cartService.totalQuantity.subscribe(
     totalQuantity => this.totalQuantity = totalQuantity
   );

  //  Subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
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

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


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
      return;
    }

    // Set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems form CartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for(let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
     */

    // - short way of doing the same thing
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // Set up purchase
    let purchase = new Purchase();

    // Populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    // Populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`)
    /*
    * If valid form then
    * - create payment intent
    * - confirm card payment
    * - place order
    */

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          // Send credit card data directly to stripe.com servers
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, {handleActions: false})
            .then(function(result) {
              if(result.error) {
                // Inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                // Call REST API via the CheckoutService
                // Place order ... store in MySQL DB Spring Boot REST API
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    // TODO Navigate to order page confirmation
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                    // Reset Cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error :err => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
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

  private resetCart() {

    // Reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // Reset the form
    this.checkoutFormGroup.reset();

    // Navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  private setupStripePaymentForm() {

    // Get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event) => {

      // Get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if(event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // Show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
  }
}
