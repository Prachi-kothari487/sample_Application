package org.example.Controller;
import org.example.Model.Playlist;
import org.example.Service.PlaylistService;
import org.example.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpSession;

import java.util.Map;
@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    private final PlaylistService playlistService;

    private final UserService userService;

    public PlaylistController(PlaylistService playlistService,UserService userService){
        this.playlistService=playlistService;
        this.userService=userService;
    }

    @PostMapping
    public ResponseEntity<?> createPlaylist(@RequestBody Playlist playlist,HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");

        if(username==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("please login first");
        }
        int userId=userService.getUserIdByUsername(username);

        int playlistId=playlistService.createPlaylist(userId,playlist.getName(),playlist.getDescription());

        return ResponseEntity.status(HttpStatus.CREATED).body("playlist created successfully. ID :"+playlistId);
    }

    @GetMapping
    public ResponseEntity<?> getUserPlaylists(HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");

        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first");
        }
        int userId=userService.getUserIdByUsername(username);

        return ResponseEntity.ok(playlistService.getUserPlaylists(userId));
    }

    @GetMapping("/{playlistId}/songs")
    public ResponseEntity<?> getPlaylistSongs(
            @PathVariable("playlistId") int playlistId,
            HttpSession session) {

        String username = (String) session.getAttribute("loggedInUser");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        int userId = userService.getUserIdByUsername(username);

        return ResponseEntity.ok(
                playlistService.getSongsByPlaylistId(playlistId, userId)
        );
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<?> deletePlaylist(@PathVariable("playlistId") int playlistId,HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");

        if(username==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("please login first");
        }

        int userId=userService.getUserIdByUsername(username);
        playlistService.deletePlaylist(playlistId,userId);
            return ResponseEntity.ok("playlist deleted successfully")    ;
    }

    @PostMapping("/{playlistId}/songs")
    public ResponseEntity<?> addSongToPlaylist(@PathVariable ("playlistId") int playlistId,@RequestBody Map<String,Integer>request,HttpSession session){
        String username = (String) session.getAttribute("loggedInUser");

        if(username==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("please login first");
        }
        int userId=userService.getUserIdByUsername(username);

        Integer songId=request.get("songId");

        if(songId==null||songId<=0){
            return ResponseEntity.badRequest().body("valid song id is required");
        }
        playlistService.addSongToPlaylist(playlistId,songId,userId);

        return ResponseEntity.status(HttpStatus.CREATED).body("Song added to playlist successfully");
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<?> removeSongFromPlaylist(@PathVariable("playlistId") int playlistId,@PathVariable("songId") int songId,HttpSession session){
        String username=(String) session.getAttribute("loggedInUser");

        if(username==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("please login first");
        }

        int userId=userService.getUserIdByUsername(username);

        playlistService.removeSongFromPlaylist(playlistId,songId,userId);

        return ResponseEntity.ok("Song removed from playlist successfully");
    }


}
