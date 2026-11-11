
package org.example.Dao;

import org.example.Model.SecurityQuestion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SecurityQuestionDao {

    private final JdbcTemplate jdbcTemplate;

    public SecurityQuestionDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public List<SecurityQuestion> getAllQuestions() {

        String sql = "select id, question from security_questions order by id";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SecurityQuestion question = new SecurityQuestion();

            question.setId(rs.getInt("id"));
            question.setQuestion(rs.getString("question"));

            return question;
        });
    }

    public int saveUserQuestion(
            int userId,
            int questionId,
            String answerHash) {

        String sql = """
                INSERT INTO user_security_questions
                (user_id, question_id, answer_hash)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                userId,
                questionId,
                answerHash
        );
    }

    public boolean hasCompletedSetup(int userId) {

        String sql = """
                SELECT COUNT(*)
                FROM user_security_questions
                WHERE user_id = ?
                """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                userId
        );

        return count!= null && count == 3;
    }
    public boolean hasAnySetup(int userId) {

        String sql = """
            SELECT COUNT(*)
            FROM user_security_questions
            WHERE user_id = ?
            """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                userId
        );

        return count != null && count > 0;
    }


    public List<SecurityQuestion> getUserSecurityQuestions(int userId) {

        String sql = "SELECT sq.id, sq.question " +
                "FROM security_questions sq " +
                "INNER JOIN user_security_questions usq " +
                "ON sq.id = usq.question_id " +
                "WHERE usq.user_id = ? " +
                "ORDER BY sq.id";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            SecurityQuestion question = new SecurityQuestion();

            question.setId(rs.getInt("id"));
            question.setQuestion(rs.getString("question"));

            return question;
        }, userId);
    }
public String getAnswerHash(int userId,int questionId){
        String sql= """
                select answer_hash 
                from user_security_questions
                where user_id=? and question_id=?
                """;

        return jdbcTemplate.query(sql,new Object[]{userId,questionId},rs->{
            if(rs.next()){
                return rs.getString("answer_hash");
            }
            return null;
        });
}
}
