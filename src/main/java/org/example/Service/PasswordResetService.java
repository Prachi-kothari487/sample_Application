
package org.example.Service;

import org.example.Dao.PasswordResetTokenDao;
import org.example.Dao.UserDao;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class PasswordResetService {

    private final PasswordResetTokenDao tokenDao;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            PasswordResetTokenDao tokenDao,
            UserDao userDao,
            PasswordEncoder passwordEncoder) {

        this.tokenDao = tokenDao;
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public String createResetToken(int userId) {

        tokenDao.invalidatePreviousTokens(userId);

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String tokenHash = hashToken(rawToken);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(30);

        tokenDao.saveToken(userId, tokenHash, expiresAt);

        return rawToken;
    }
    public boolean validateResetToken(String rawToken) {

        if (rawToken == null || rawToken.trim().isEmpty()) {
            return false;
        }

        String tokenHash = hashToken(rawToken);

        Integer userId = tokenDao.getUserIdByValidToken(tokenHash);

        return userId != null;
    }
    @Transactional
    public boolean resetPassword(String rawToken, String newPassword) {

        if (rawToken == null || rawToken.trim().isEmpty()
                || newPassword == null || newPassword.trim().isEmpty()) {
            return false;
        }

        String tokenHash = hashToken(rawToken);

        Integer userId = tokenDao.getUserIdByValidToken(tokenHash);

        if (userId == null) {
            return false;
        }

        String encodedPassword = passwordEncoder.encode(newPassword);

        int updatedRows = userDao.updatePassword(userId, encodedPassword);

        if (updatedRows != 1) {
            return false;
        }

        int usedRows = tokenDao.markTokenAsUsed(tokenHash);

        if (usedRows != 1) {
            throw new IllegalStateException(
                    "Reset token could not be marked as used"
            );
        }

        return true;
    }
    public String hashToken(String rawToken) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hashedBytes);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to generate reset token hash", e
            );
        }
    }
}
