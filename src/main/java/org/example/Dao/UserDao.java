
package org.example.Dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.example.Model.User;
@Repository
public class UserDao {

    private final JdbcTemplate jdbcTemplate;

    public UserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer getUserCount() {
        String sql = "SELECT COUNT(*) FROM users";

        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    public User findByName(String name){
        String sql="select id,name,password from users where name=? ";

        return jdbcTemplate.query(
                sql,
                new Object[]{name},
                rs->{
                    if(rs.next()){
                        User user=new User();
                        user.setId(rs.getInt("id"));
                        user.setName(rs.getString("name"));
                        user.setPassword(rs.getString("password"));

                        return user;
                    }
                    return null;
                }
        );
    }
}
