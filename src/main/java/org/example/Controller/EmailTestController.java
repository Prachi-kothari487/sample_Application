package org.example.Controller;

import org.example.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/test")
    public String sendTestEmail(@RequestParam("to") String to) {

        emailService.sendEmail(
                to,
                "MusicVault SMTP Test",
                "Hello! Your MusicVault email configuration is working successfully."
        );

        return "Test email sent successfully!";
    }
}