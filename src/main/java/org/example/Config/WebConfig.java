
package org.example.Config;

import org.example.Dao.UserDao;
import org.example.Service.SecurityQuestionService;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.example.Controller")
public class WebConfig implements WebMvcConfigurer {

    private final SecurityQuestionService securityQuestionService;
    private final UserDao userDao;

    public WebConfig(
            SecurityQuestionService securityQuestionService,
            UserDao userDao) {

        this.securityQuestionService = securityQuestionService;
        this.userDao = userDao;
    }

    @Override
    public void configureDefaultServletHandling(
            DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(
                new RoleBasedAccessInterceptor(
                        securityQuestionService,
                        userDao
                )
        ).addPathPatterns("/api/**");
    }
}
