
package org.example.Controller;

import org.example.Service.LikedSongService;
import org.example.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/songs")
public class LikedSongController {

    private final LikedSongService likedSongService;
    private final UserService userService;

    public LikedSongController(LikedSongService likedSongService,
                               UserService userService) {
        this.likedSongService = likedSongService;
        this.userService = userService;
    }

    // Like a song
    @PostMapping("/{songId}/like")
    public ResponseEntity<?> likeSong(
            @PathVariable("songId") int songId,
            HttpSession session) {

        String username = (String) session.getAttribute("loggedInUser");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        if (songId <= 0) {
            return ResponseEntity.badRequest()
                    .body("Valid song ID is required");
        }

        int userId = userService.getUserIdByUsername(username);

        likedSongService.likeSong(userId, songId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Song liked successfully");
    }

    // Get logged-in user's liked songs
    @GetMapping("/liked")
    public ResponseEntity<?> getLikedSongs(HttpSession session) {

        String username = (String) session.getAttribute("loggedInUser");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        int userId = userService.getUserIdByUsername(username);

        return ResponseEntity.ok(
                likedSongService.getLikedSongs(userId)
        );
    }

    // Unlike a song
    @DeleteMapping("/{songId}/like")
    public ResponseEntity<?> unlikeSong(
            @PathVariable("songId") int songId,
            HttpSession session) {

        String username = (String) session.getAttribute("loggedInUser");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        if (songId <= 0) {
            return ResponseEntity.badRequest()
                    .body("Valid song ID is required");
        }

        int userId = userService.getUserIdByUsername(username);

        likedSongService.unlikeSong(userId, songId);

        return ResponseEntity.ok("Song unliked successfully");
    }
}
