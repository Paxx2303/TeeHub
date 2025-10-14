package com.example.backend.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    @GetMapping("/Home")
    @ResponseBody
    public String home() {
        return "Hello World"; // Trả về chuỗi "Hello World" trực tiếp
    }


}
