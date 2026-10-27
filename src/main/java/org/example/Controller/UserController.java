package org.example.Controller;
import org.example.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.Model.User;
import org.example.Model.CreateUserRequest;
import org.example.Model.UserResponse;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.example.Model.UpdateUserRequest;
import org.example.Model.PaginationResponse;
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") int id){
        UserResponse user=userService.getUserById(id);
        if(user==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponse>createUser(@RequestBody CreateUserRequest request){
        User user=new User();
        user.setName(request.getUsername());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        UserResponse createdUser=userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse>updateUser(
            @PathVariable("id") int id,@RequestBody UpdateUserRequest request
    ){
        UserResponse updatedUser=userService.updateUser(id,request);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<UserResponse> disableUser(@PathVariable("id") int id){
        UserResponse disabledUser=userService.disableUser(id);
        return ResponseEntity.ok(disabledUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") int id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<UserResponse> searchUsers(@RequestParam("name") String name){
        return userService.searchUsers(name);
    }

    @GetMapping("/filter")
    public List<UserResponse> filterUsers(
            @RequestParam(value="role",required = false) String role,@RequestParam(value="status",required = false) String status
    ){
        return userService.filterUsers(role,status);
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<String> enableUser(@PathVariable("id") int id) {
        boolean enabled = userService.enableUser(id);

        if (!enabled) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("User activated successfully");
    }

    @GetMapping("/page")
    public ResponseEntity<PaginationResponse> getUsersByPage(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        if(page<1 || size<1){
            return ResponseEntity.badRequest().build();
        }
        PaginationResponse response=userService.getUsersByPage(page,size);
        return ResponseEntity.ok(response);
    }



}
