package com.freudromero.ecomerce.dto;


import lombok.Data;
import lombok.NonNull;

// Use this class to send back a Java object as JSON
@Data
public class PurchaseResponse {

    private final String orderTrackingNumber;

}
