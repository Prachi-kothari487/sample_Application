package org.example.Model;

public class UserResponse {
    private int id;
    private String name;
    private String firstname;
    private String lastname;
    private String email;
    private String role;
    private String status;



    public UserResponse(int id,String name,String firstname,String lastname,String email,String role,String status){
        this.id=id;
        this.name=name;
        this.firstname=firstname;
        this.lastname=lastname;
        this.email=email;
        this.role=role;
        this.status=status;

    }
public int getId(){
        return id;
}
public String getName(){
        return name;
}

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }
}
