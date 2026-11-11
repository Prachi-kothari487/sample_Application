package org.example.Model;
import java.util.List;
public class SecurityQuestionSetupRequest {
    private List<SecurityQuestionAnswer>answers;
    public List<SecurityQuestionAnswer>getAnswers(){
        return answers;
    }
    public void setAnswers(List <SecurityQuestionAnswer> answers){
        this.answers=answers;
    }
}
