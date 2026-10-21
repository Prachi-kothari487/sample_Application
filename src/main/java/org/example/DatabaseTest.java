package org.example;
import org.example.Dao.UserDao;
import org.example.Config.AppConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
public class DatabaseTest {

    public static void main(String[] args){
        AnnotationConfigApplicationContext context=new AnnotationConfigApplicationContext(AppConfig.class);

        UserDao userDao=context.getBean(UserDao.class);

        Integer count=userDao.getUserCount();

        System.out.println("Total users in database: "+count);

        context.close();
    }
}
