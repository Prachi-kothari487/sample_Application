package org.example.Controller;
import org.example.Service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.example.Service.UserService;
import org.example.Model.UserResponse;
@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;
    private final UserService userService;
    public LoginController(LoginService loginService,UserService userService){
        this.loginService=loginService;
        this.userService = userService;
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String,String> request,HttpSession session){
        String name= request.get("name");
        String password=request.get("password");

        boolean valid=loginService.login(name,password);
        if(valid){

            session.setAttribute("loggedInUser", name);

            return ResponseEntity.ok("Login successful");

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid username or password");
    }


    @GetMapping("/session")
    public ResponseEntity<String> checkSession(HttpSession session) {

        String name = (String) session.getAttribute("loggedInUser");

        if (name != null) {
            return ResponseEntity.ok("Logged in as: " + name);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("You are not logged in");
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session){
        session.invalidate();

        return ResponseEntity.ok("Logout Successful");

    }
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {

        String username = (String) session.getAttribute("loggedInUser");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        UserResponse profile = userService.getProfile(username);

        return ResponseEntity.ok(profile);
    }







}
