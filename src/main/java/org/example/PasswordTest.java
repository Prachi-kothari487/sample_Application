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
//Exactly! That's the flow we're implementing.
//
//Let's make the requirement crystal clear:
//
//        ### MusicVault — First-time login and Forgot Password flow
//
//Part 1: First-time login
//
//1. Admin creates a user with username and password.
//        2. User logs in using those credentials.
//        3. Backend checks whether the user has configured security questions.
//4. First-time setup
//
//If not configured, user is redirected to Security Questions Setup.
//5. User selects exactly 3 questions from our fixed list of 10 and enters answers.
//6. Backend hashes the answers using BCrypt and saves them.
//7. User proceeds to the MusicVault dashboard.
//
//Part 2: Forgot Password (in the future)
//
//1. User clicks Forgot Password.
//        2. Enters username.
//        3. Backend retrieves their 3 previously selected questions.
//4. User enters answers.
//5. Backend verifies the answers.
//        6. If correct, user gets access to Change Password.
//7. New password is saved securely using BCrypt.
//8. User returns to Login.
//
//        ### One important security detail
//
//After successful login, we should check whether the user has completed security setup before allowing access to the dashboard or other protected features. We'll enforce this on the backend, not just through frontend redirection.
//
//        So yes, your understanding is absolutely correct.
//
//Now let's continue with `LoginService.java`. I want to inspect your existing authentication logic before we extend it.