package com.freudromero.ecomerce.dao;

import com.freudromero.ecomerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long > {
}
