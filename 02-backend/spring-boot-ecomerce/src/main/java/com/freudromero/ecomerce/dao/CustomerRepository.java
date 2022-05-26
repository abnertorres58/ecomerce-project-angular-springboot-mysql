package com.freudromero.ecomerce.dao;

import com.freudromero.ecomerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository  extends JpaRepository<Customer, Long> {

    //Behind scenes Spring will execute a query similar to this
    // SELECT * FROM Customer c WHERE c.email = theEmail
    // Returns null if not found
    Customer findByEmail(String theEmail);

}
