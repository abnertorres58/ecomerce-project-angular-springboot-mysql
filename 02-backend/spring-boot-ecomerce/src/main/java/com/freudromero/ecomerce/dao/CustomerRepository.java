package com.freudromero.ecomerce.dao;

import com.freudromero.ecomerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository  extends JpaRepository<Customer, Long> {
}
