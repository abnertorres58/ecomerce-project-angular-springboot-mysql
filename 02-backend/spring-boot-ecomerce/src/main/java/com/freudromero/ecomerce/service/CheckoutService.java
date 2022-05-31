package com.freudromero.ecomerce.service;

import com.freudromero.ecomerce.dto.PaymentInfo;
import com.freudromero.ecomerce.dto.Purchase;
import com.freudromero.ecomerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;

}
