package org.example.Controller;
import org.example.*;
import org.example.Dao.UserDao;
import org.example.Model.SecurityQuestion;
import org.example.Model.User;
import org.example.Service.SecurityQuestionService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.example.Model.ForgotPasswordRequest;
import org.example.Model.VerifySecurityAnswersRequest;
import org.example.Service.PasswordResetService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {
    private final UserDao userDao;
    private final SecurityQuestionService securityQuestionService;
    private final PasswordResetService passwordResetService;
    private final JavaMailSender mailSender;
    public ForgotPasswordController(UserDao userDao, SecurityQuestionService securityQuestionService,PasswordResetService passwordResetService,
                                    JavaMailSender mailSender){
        this.userDao=userDao;
        this.securityQuestionService=securityQuestionService;
        this.passwordResetService = passwordResetService;
        this.mailSender = mailSender;
    }

    @PostMapping("/forgot-password/questions")
    public ResponseEntity<?> getSecurityQuestions(@RequestBody ForgotPasswordRequest request){
        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        User user=userDao.findByEmail(request.getEmail().trim());

        if(user==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("unable to process forgot password request");
        }

        if(!securityQuestionService.hasCompletedSetup(user.getId())){
            return ResponseEntity.badRequest().body("security questions are not configured");
        }

        List<SecurityQuestion> questions=securityQuestionService.getUserSecurityQuestions(user.getId());

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/verify-security-answers")
    public ResponseEntity<?> verifySecurityAnswers(@RequestBody VerifySecurityAnswersRequest request){
        if(request.getEmail()==null||request.getEmail().trim().isEmpty()){
            return ResponseEntity.badRequest().body("email is required");
        }
        User user=userDao.findByEmail(request.getEmail().trim());
        if(user==null){
            return ResponseEntity.badRequest().body("unable to verify security answers");
        }
        boolean verified=securityQuestionService.verifySecurityAnswers(user.getId(), request.getAnswers());
        if(!verified){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("incorrect securioty answer");
        }
        String rawToken=passwordResetService.createResetToken(user.getId());

        String resetLink="http://localhost:8080/sample-application/?resetToken="+rawToken;

        SimpleMailMessage message=new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Password reset mail");
        message.setText("Hello"+user.getFirstName()+",\n\n"+"your security answer have been verified.\n\n"+"click the link below to reset your password:\n\n"+resetLink+"\n\n"+"this link will expires in 30 mins.\n\n");
        mailSender.send(message);

        return ResponseEntity.ok("security answers verified . password reset link sent to your registered email. ");
    }

}
