package com.nucms.cms.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "up");
        response.put("message", "nu-CMS API Server is running");
        response.put("frontend_url", "http://localhost:5173");
        return response;
    }
}
