package com.freudromero.ecomerce.dto;


import lombok.Data;

// Use this class to send back a Java object as JSON
@Data
public class PurchaseResponse {

    private String orderTrackingNumber;

}
