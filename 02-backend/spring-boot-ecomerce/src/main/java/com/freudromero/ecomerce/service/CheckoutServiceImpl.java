package com.freudromero.ecomerce.service;

import com.freudromero.ecomerce.dao.CustomerRepository;
import com.freudromero.ecomerce.dto.Purchase;
import com.freudromero.ecomerce.dto.PurchaseResponse;
import com.freudromero.ecomerce.entity.Customer;
import com.freudromero.ecomerce.entity.Order;
import com.freudromero.ecomerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;


@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    // @Autowired is optional since there is ony one constructor
    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // Retrieve the order info from dto
        Order order = purchase.getOrder();

        // Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // Populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // Save to database
        customerRepository.save(customer);

        // Return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    // We want to create a unique id that is hard to guess and random
    private String generateOrderTrackingNumber() {

        // Generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
