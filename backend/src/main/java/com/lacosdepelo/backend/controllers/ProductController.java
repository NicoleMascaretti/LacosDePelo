package com.lacosdepelo.backend.controllers;

import com.lacosdepelo.backend.models.ProductModel;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping
    public List<ProductModel> getAllProducts() {
        List<ProductModel> mockProducts = new ArrayList<>();

        ProductModel p1 = new ProductModel();
        p1.setId("1");
        p1.setTitle("Laço de Cetim Vermelho");
        p1.setPrice("29.90");
        p1.setImage("https://via.placeholder.com/200x200.png?text=Laço+Vermelho");
        p1.setVariantId("gid://shopify/ProductVariant/1111111111");

        ProductModel p2 = new ProductModel();
        p2.setId("2");
        p2.setTitle("Faixa de Cabelo Floral");
        p2.setPrice("34.90");
        p2.setImage("https://via.placeholder.com/200x200.png?text=Faixa+Floral");
        p2.setVariantId("gid://shopify/ProductVariant/2222222222");

        mockProducts.add(p1);
        mockProducts.add(p2);

        return mockProducts;
    }
}
