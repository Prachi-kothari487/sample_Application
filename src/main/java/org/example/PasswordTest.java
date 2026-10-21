package org.example;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class PasswordTest {

    public static void main(String args[]){
        BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();

        String password="admin1";

        String hashedPassword=encoder.encode(password);

        System.out.println("Hashed Password :"+hashedPassword);

        System.out.println("Password matches :"+encoder.matches(password,hashedPassword));

    }
}
