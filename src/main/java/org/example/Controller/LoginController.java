package org.example.Controller;
import org.example.Service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService){
        this.loginService=loginService;
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String,String> request){
        String name= request.get("name");
        String password=request.get("password");

        boolean valid=loginService.login(name,password);
        if(valid){
            return ResponseEntity.ok("Login successful");

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid username or password");
    }



}
