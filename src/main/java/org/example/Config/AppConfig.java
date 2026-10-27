package org.example.Config;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;

@Configuration
@PropertySource("classpath:db.properties")
@ComponentScan({"org.example.**"})
public class AppConfig {

    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(env.getProperty("db.url"));
        cfg.setUsername(env.getProperty("db.username"));
        cfg.setPassword(env.getProperty("db.password"));
        cfg.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return new HikariDataSource(cfg);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}