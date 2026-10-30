
package org.example.Dao;

import org.example.Model.UpdateUserRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.example.Model.User;

import java.util.ArrayList;
import java.util.List;

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
        String sql="select * from users where name=? ";

        return jdbcTemplate.query(
                sql,
                new Object[]{name},
                rs->{
                    if(rs.next()){
                        User user=new User();
                        user.setId(rs.getInt("id"));
                        user.setName(rs.getString("name"));
                        user.setPassword(rs.getString("password"));
                        user.setFirstName(rs.getString("first_name"));
                        user.setLastName(rs.getString("last_name"));
                        user.setEmail(rs.getString("email"));
                        user.setRole(rs.getString("role"));
                        user.setStatus(rs.getString("status"));

                        return user;
                    }
                    return null;
                }
        );
    }


    public List<User> findAll(){
        String sql="Select * from users";

        return jdbcTemplate.query(sql,(rs,rowNum)->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setEmail(rs.getString("email"));
            user.setRole(rs.getString("role"));
            user.setStatus(rs.getString("status"));
            return user;
        });
    }


    public List<User> searchByName(String name) {
        String sql = "SELECT * FROM users WHERE name LIKE ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setEmail(rs.getString("email"));
            user.setRole(rs.getString("role"));
            user.setStatus(rs.getString("status"));
            return user;
        }, "%" + name + "%");
    }




    public User findById(int id){
        String sql = "select * from users where id = ?";

        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setEmail(rs.getString("email"));
            user.setRole(rs.getString("role"));
            user.setStatus(rs.getString("status"));
            return user;
        }, id);

        return users.isEmpty() ? null : users.get(0);
    }


    public int createUser(User user) {
        String sql = "INSERT INTO users (name, password, first_name, last_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.update(
                sql,
                user.getName(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }


    public int updateUser(int id, UpdateUserRequest request){
        StringBuilder sql=new StringBuilder("UPDATE users set ");
        List<Object>params=new ArrayList<>();
        List<String>updates=new ArrayList<>();

        if(request.getFirstname()!=null){
            updates.add(" first_name = ? ");
            params.add(request.getFirstname());
        }
        if(request.getLastname()!=null){
            updates.add(" last_name = ? ");
            params.add(request.getLastname());

        }
        if(request.getEmail()!=null){
            updates.add(" email = ? ");
            params.add(request.getEmail());
        }
        if(request.getRole()!=null){
            updates.add(" role= ? ");
            params.add(request.getRole());
        }
        if(request.getStatus()!=null){
            updates.add(" status = ? ");
            params.add(request.getStatus());
        }
        if(updates.isEmpty()){
            return 0;
        }
        sql.append(String.join(", ",updates));
        sql.append(" where id = ?");
        params.add(id);
        return jdbcTemplate.update(sql.toString(),params.toArray());
    }

    public int disableUser(int id){
        String sql="update users set status=? where id=? ";

        return jdbcTemplate.update(sql,"INACTIVE",id);
    }

    public int enableUser(int id){
        String sql="update users set status=? where id=?";
        return jdbcTemplate.update(sql,"ACTIVE",id);
    }

    public int deleteUser(int id){
        String sql="Delete from users where id=?";
        return jdbcTemplate.update(sql,id);
    }

    public List<User> filterUsers(String role,String status){
        StringBuilder sql=new StringBuilder("select * from users where 1=1");
        List<Object> params=new ArrayList<>();

        if(role!=null && !role.isBlank()){
            sql.append(" AND role= ?");
            params.add(role);
        }

        if(status!=null && !status.isBlank()){
            sql.append("  status = ? ");
            params.add(status);
        }

        return jdbcTemplate.query(sql.toString(),(rs,rowNum)->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setEmail(rs.getString("email"));
            user.setRole(rs.getString("role"));
            user.setStatus(rs.getString("status"));
            return user;

        },params.toArray());
    }


    public List<User> findUsersByPage(int limit,int offset){
        String sql="select * from users order by id limit ? offset ?";

        return jdbcTemplate.query(sql,(rs,rowNum)->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setPassword(rs.getString("password"));
            user.setFirstName(rs.getString("first_name"));
            user.setLastName(rs.getString("last_name"));
            user.setRole(rs.getString("role"));
            user.setStatus(rs.getString("status"));
            return user;
        },limit,offset);
    }




}
