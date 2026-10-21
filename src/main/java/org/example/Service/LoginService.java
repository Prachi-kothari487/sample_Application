package org.example.Service;
import org.example.Dao.UserDao;
import org.example.Model.User;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class LoginService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public LoginService(UserDao userDao,PasswordEncoder passwordEncoder){
        this.userDao=userDao;
        this.passwordEncoder=passwordEncoder;
    }

    public boolean login(String name,String password){
        User user=userDao.findByName(name);

        if(user==null){
            return false;
        }
        return passwordEncoder.matches(
                password,
                user.getPassword()
        );
    }
}
