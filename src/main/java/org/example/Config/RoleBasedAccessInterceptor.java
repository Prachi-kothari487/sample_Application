
package org.example.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

public class RoleBasedAccessInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        String method = request.getMethod();

        // Allow browser preflight requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        String path = request.getRequestURI()
                .substring(request.getContextPath().length());

        // Login API is public
        if ("/api/auth/login".equals(path)) {
            return true;
        }

        HttpSession session = request.getSession(false);

        // Check whether user is logged in
        if (session == null ||
                session.getAttribute("loggedInUser") == null) {

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Please login first"
            );
            return false;
        }

        String role = (String) session.getAttribute("loggedInRole");

        // Admin-only access: User Management
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


// Songs: both ADMIN and USER can view and search
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


        // All other authenticated API requests can proceed
        return true;
    }
}
