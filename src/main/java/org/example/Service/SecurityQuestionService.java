
package org.example.Service;

import org.example.Dao.SecurityQuestionDao;
import org.example.Model.SecurityQuestion;
import org.example.Model.SecurityQuestionAnswer;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class SecurityQuestionService {

    private final SecurityQuestionDao securityQuestionDao;
    private final PasswordEncoder passwordEncoder;

    public SecurityQuestionService(
            SecurityQuestionDao securityQuestionDao,
            PasswordEncoder passwordEncoder) {

        this.securityQuestionDao = securityQuestionDao;
        this.passwordEncoder = passwordEncoder;
    }


    public List<SecurityQuestion> getAllQuestions() {
        return securityQuestionDao.getAllQuestions();
    }


    @Transactional
    public void saveSecurityQuestions(
            int userId,
            List<SecurityQuestionAnswer> answers) {

        if (answers == null || answers.size() != 3) {
            throw new IllegalArgumentException(
                    "Please select exactly 3 security questions"
            );
        }

        if (securityQuestionDao.hasAnySetup(userId)) {
            throw new IllegalArgumentException(
                    "Security questions are already configured"
            );
        }

        Set<Integer> selectedQuestionIds = new HashSet<>();

        for (SecurityQuestionAnswer item : answers) {

            if (item == null) {
                throw new IllegalArgumentException(
                        "Invalid security question"
                );
            }

            int questionId = item.getQuestionId();
            String answer = item.getAnswer();

            if (questionId < 1 || questionId > 10) {
                throw new IllegalArgumentException(
                        "Invalid security question selected"
                );
            }
            if (!selectedQuestionIds.add(questionId)) {
                throw new IllegalArgumentException(
                        "Please select 3 different questions"
                );
            }
            if (answer == null || answer.isBlank()) {
                throw new IllegalArgumentException(
                        "All three answers are required"
                );
            }

            String normalizedAnswer = answer.trim().toLowerCase(Locale.ROOT);

            String answerHash = passwordEncoder.encode(normalizedAnswer);

            securityQuestionDao.saveUserQuestion(
                    userId,
                    questionId,
                    answerHash
            );
        }
    }

    public boolean hasCompletedSetup(int userId) {
        return securityQuestionDao.hasCompletedSetup(userId);
    }


    public List<SecurityQuestion> getUserSecurityQuestions(int userId) {
        return securityQuestionDao.getUserSecurityQuestions(userId);
    }

    public boolean verifySecurityAnswers(int userId,List<SecurityQuestionAnswer>answers){
        if(answers==null || answers.size()!=3){
            return false;
        }
        Set<Integer> questionIds=new HashSet<>();

        for(SecurityQuestionAnswer item:answers){
            if(item==null || item.getAnswer()==null || item.getAnswer().trim().isEmpty()){
                return false;
            }
            int questionId=item.getQuestionId();
            if(!questionIds.add(questionId)){
                return false;
            }
            String storedHash=securityQuestionDao.getAnswerHash(userId,questionId);

            if(storedHash==null){
                return false;
            }
            String normalizedAnswer=item.getAnswer().trim().toLowerCase(Locale.ROOT);

            if(!passwordEncoder.matches(normalizedAnswer,storedHash)){
                return false;
            }
        }
        return true;
    }
}
