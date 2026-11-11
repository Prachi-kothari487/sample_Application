package org.example.Dao;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;



@Repository
public class PasswordResetTokenDao {

    private final JdbcTemplate jdbcTemplate;

    public PasswordResetTokenDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    public void saveToken(int userId,String tokenHash,LocalDateTime expiredAt){
        String sql = """
                INSERT INTO password_reset_tokens
                (user_id, token_hash, expires_at)
                VALUES (?, ?, ?)
                """;


        jdbcTemplate.update(sql,userId,tokenHash,Timestamp.valueOf(expiredAt));


    }

    public boolean existsValidToken(String tokenHash){
        String sql= """
                select count(*) 
                from password_reset_tokens
                where token_hash=?
                and used=false
                and expires_at>now()
                """;

        Integer count=jdbcTemplate.queryForObject(sql,Integer.class,tokenHash);
        return count!=null && count>0;
    }

    public int markTokenAsUsed(String tokenHash){
        String sql= """
                update password_reset_tokens
                set used=true
                where token_hash=?
                and used=false
                and expires_at>now()
                """;

        return jdbcTemplate.update(sql,tokenHash);
    }

    public void invalidatePreviousTokens(int userId) {

        String sql = "UPDATE password_reset_tokens SET used = TRUE " +
                "WHERE user_id = ? AND used = FALSE";

        jdbcTemplate.update(sql, userId);
    }

    public Integer getUserIdByValidToken(String tokenHash) {

        String sql = """
            SELECT user_id
            FROM password_reset_tokens
            WHERE token_hash = ?
            AND used = FALSE
            AND expires_at > NOW()
            """;

        return jdbcTemplate.query(
                sql,
                new Object[]{tokenHash},
                rs -> {
                    if (rs.next()) {
                        return rs.getInt("user_id");
                    }
                    return null;
                }
        );
    }


}

