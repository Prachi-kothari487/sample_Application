package org.example;
import org.example.Config.AppConfig;
import org.example.Service.LoginService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
public class LoginServiceTest {
    public static void main(String args[]){
        AnnotationConfigApplicationContext context=new AnnotationConfigApplicationContext(AppConfig.class);

        LoginService loginService =
                context.getBean(LoginService.class);
        boolean result=loginService.login("k","admin14");

        System.out.println("login result :" +result);

        context.close();
    }
}
