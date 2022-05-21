package com.freudromero.ecomerce.service;

import com.freudromero.ecomerce.dto.Purchase;
import com.freudromero.ecomerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
