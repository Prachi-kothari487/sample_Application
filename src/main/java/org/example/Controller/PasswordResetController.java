package org.example.Controller;
import org.eclipse.angus.mail.iap.Response;
import org.example.Model.ResetPasswordRequest;
import org.example.Service.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService){
        this.passwordResetService=passwordResetService;
    }

    @GetMapping("/reset-password/validate")
    public ResponseEntity<?>validateToken(@RequestParam ("token") String token){
        boolean valid=passwordResetService.validateResetToken(token);

        if(!valid){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("reset link is invalid or expired");
        }

        return ResponseEntity.ok("reset link is valid");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){
        if(request.getToken()==null || request.getNewPassword()==null ||request.getNewPassword().trim().isEmpty()){
            return ResponseEntity.badRequest().body("token and new password are required");
        }
        boolean reset=passwordResetService.resetPassword(request.getToken(),request.getNewPassword());

        if(!reset){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("reset link is invalid or expired");
        }

        return ResponseEntity.ok("password reset successful.please login with your new password");
    }
}
