
package org.example.Model;

import java.util.List;

public class VerifySecurityAnswersRequest {

    private String email;
    private List<SecurityQuestionAnswer> answers;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<SecurityQuestionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SecurityQuestionAnswer> answers) {
        this.answers = answers;
    }
}
