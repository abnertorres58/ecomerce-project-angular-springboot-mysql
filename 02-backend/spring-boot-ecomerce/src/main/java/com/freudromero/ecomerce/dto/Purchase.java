package com.freudromero.ecomerce.dto;

import com.freudromero.ecomerce.entity.Address;
import com.freudromero.ecomerce.entity.Customer;
import com.freudromero.ecomerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Set<OrderItem> orderItems;
}
