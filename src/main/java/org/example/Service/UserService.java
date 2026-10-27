package org.example.Service;
import org.example.Dao.UserDao;
import org.springframework.stereotype.Service;
import org.example.Model.User;
import java.util.List;
import org.example.Model.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import org.example.Model.UpdateUserRequest;
@Service
public class UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserDao userDao,PasswordEncoder passwordEncoder){
        this.userDao=userDao;
        this.passwordEncoder=passwordEncoder;
    }

    public List<UserResponse> getAllUsers(){
        return userDao.findAll().stream().map(user -> new UserResponse(user.getId(), user.getName(),user.getFirstName(),user.getLastName(),user.getEmail(),user.getRole(),user.getStatus())).toList();
    }

    public UserResponse getUserById(int id){
        User user=userDao.findById(id);

        if(user==null){
            return null;
        }
        return new UserResponse(user.getId(),user.getName(),user.getFirstName(),user.getLastName(),user.getEmail(),user.getRole(), user.getStatus());

    }

    public UserResponse createUser(User user){
        User existingUser=userDao.findByName(user.getName());

        if(existingUser!=null){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        int rowsInserted=userDao.createUser(user);

        if(rowsInserted!=1){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"failed to create a user");
        }
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
    public UserResponse updateUser(int id,UpdateUserRequest request){
        if(request.getFirstname()==null && request.getLastname()==null && request.getEmail()==null && request.getRole()==null && request.getStatus()==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"at least one field is required to update");
        }
        User existingUser=userDao.findById(id);

        if(existingUser==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");
        }
        userDao.updateUser(id,request);
        return getUserById(id);
    }

    public UserResponse disableUser(int id){
        User existingUser=userDao.findById(id);
        if(existingUser==null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found");
        }
        userDao.disableUser(id);
        return getUserById(id);
    }

    public void deleteUser(int id){
        User existingUser=userDao.findById(id);
        if(existingUser==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found");
        }
        userDao.deleteUser(id);
    }

    public List<UserResponse> searchUsers(String name){
        List<User> users=userDao.searchByName(name);
        return users.stream().map(user->new UserResponse(user.getId(),user.getName(),user.getFirstName(),user.getLastName(),user.getEmail(),user.getRole(),user.getStatus())).toList();
    }


    public List<UserResponse> filterUsers(String role, String status) {
        List<User> users = userDao.filterUsers(role, status);

        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus()
                ))
                .toList();
    }

    public boolean enableUser(int id){
        User user=userDao.findById(id);
        if(user==null){
            return false;
        }
        userDao.enableUser(id);
        return true;
    }

    public List<UserResponse> getUsersByPage(int page,int size){
        int offset=(page-1)*size;

        List<User> users=userDao.findUsersByPage(size,offset);

        return users.stream().map(user->new UserResponse(user.getId(),user.getName(),user.getFirstName(),user.getLastName(),user.getEmail(),user.getRole(),user.getStatus())).toList();

    }


}
