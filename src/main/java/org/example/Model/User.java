package org.example.Model;


public class User

{

    private int id;
    private String name;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;

    public User(){

    }
    public User(int id, String name, String password,String firstName,String lastName,String email,String role,String status){
        this.id=id;
        this.name=name;
        this.password=password;
        this.firstName=firstName;
        this.lastName=lastName;
        this.email=email;
        this.role=role;
        this.status=status;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
