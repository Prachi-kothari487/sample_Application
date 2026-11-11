
package org.example.Controller;

import org.example.Model.SecurityQuestion;
import org.example.Service.SecurityQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.Dao.UserDao;
import org.example.Model.User;
import org.example.Model.SecurityQuestionSetupRequest;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequestMapping("/api/auth")
public class SecurityQuestionController {

    private final SecurityQuestionService securityQuestionService;
    private final UserDao userDao;
    public SecurityQuestionController(
            SecurityQuestionService securityQuestionService,UserDao userDao) {
        this.securityQuestionService = securityQuestionService;
        this.userDao=userDao;
    }
    @PostMapping("/security-questions")
    public ResponseEntity<String> setupSecurityQuestions(@RequestBody SecurityQuestionSetupRequest request,HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");
        User user=userDao.findByName(username);
        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user not found");
        }
        try{
            securityQuestionService.saveSecurityQuestions(user.getId(),request.getAnswers());

            return ResponseEntity.ok("security questions configured successfully");
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/security-questions")
    public ResponseEntity<List<SecurityQuestion>> getAllQuestions() {

        List<SecurityQuestion> questions =
                securityQuestionService.getAllQuestions();

        return ResponseEntity.ok(questions);
    }
    @GetMapping("/security-questions/status")
    public ResponseEntity<Boolean> getSecurityQuestionStatus(HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");

        User user=userDao.findByName(username);

        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean completed=securityQuestionService.hasCompletedSetup(user.getId());

        return ResponseEntity.ok(completed);
    }
}
