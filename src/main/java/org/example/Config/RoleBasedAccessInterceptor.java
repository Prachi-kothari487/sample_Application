
package org.example.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.example.Dao.UserDao;
import org.example.Model.User;
import org.example.Service.SecurityQuestionService;
import org.springframework.web.servlet.HandlerInterceptor;

public class RoleBasedAccessInterceptor implements HandlerInterceptor {

    private final SecurityQuestionService securityQuestionService;
    private final UserDao userDao;

    public RoleBasedAccessInterceptor(
            SecurityQuestionService securityQuestionService,
            UserDao userDao) {

        this.securityQuestionService = securityQuestionService;
        this.userDao = userDao;
    }



    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        String method = request.getMethod();



        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        String path = request.getRequestURI()
                .substring(request.getContextPath().length());



        if ("POST".equalsIgnoreCase(method)
                && "/api/auth/login".equals(path)) {
            return true;
        }
        if("POST".equalsIgnoreCase(method)&& "/api/auth/forgot-password/questions".equals(path)){
            return true;
        }
        if ("POST".equalsIgnoreCase(method)
                && "/api/auth/verify-security-answers".equals(path)) {
            return true;
        }
        if ("GET".equalsIgnoreCase(method)
                && "/api/auth/reset-password/validate".equals(path)) {
            return true;
        }

        if ("POST".equalsIgnoreCase(method)
                && "/api/auth/reset-password".equals(path)) {
            return true;
        }
        if ("GET".equalsIgnoreCase(method)
                && "/api/auth/security-questions".equals(path)) {
            return true;
        }

        HttpSession session = request.getSession(false);

        if (session == null ||
                session.getAttribute("loggedInUser") == null) {

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Please login first"
            );
            return false;
        }
        String username =
                (String) session.getAttribute("loggedInUser");

        User user = userDao.findByName(username);

        if (user == null) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "User not found"
            );
            return false;
        }

        boolean setupCompleted =
                securityQuestionService.hasCompletedSetup(user.getId());

        boolean isSetupRequest =
                ("POST".equalsIgnoreCase(method)
                        && "/api/auth/security-questions".equals(path))
                        ||
                        ("GET".equalsIgnoreCase(method)
                                && "/api/auth/security-questions/status".equals(path))
                        ||
                        "/api/auth/logout".equals(path);

        if (!setupCompleted && !isSetupRequest) {

            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Please complete security question setup first"
            );
            return false;
        }
        String role = (String) session.getAttribute("loggedInRole");
        if (path.equals("/api/users") ||
                path.startsWith("/api/users/")) {

            if (!"ADMIN".equalsIgnoreCase(role)) {

                response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Admin access required"
                );
                return false;
            }
        }
        if (path.equals("/api/songs") ||
                path.startsWith("/api/songs/")) {

            boolean isReadRequest =
                    "GET".equalsIgnoreCase(method);

            boolean isSearchRequest =
                    "POST".equalsIgnoreCase(method)
                            && "/api/songs/search".equals(path);

            boolean isAdmin =
                    "ADMIN".equalsIgnoreCase(role);

            if (!isReadRequest && !isSearchRequest && !isAdmin) {

                response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Only Admin can add, update or delete songs"
                );
                return false;
            }
        }


        return true;
    }
}
