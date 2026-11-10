package org.example.Controller;
import org.example.Model.SongSearchRequest;
import org.example.Model.PaginationResponse;
import org.example.Service.SongService;
import org.example.Model.Song;
import org.example.Model.UpdateSongRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.example.Model.SongPaginationResponse;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<Song> getAllSongs(){
        return songService.getAllSongs();
    }

    @GetMapping("/{id}")
    public Song getSongById(@PathVariable ("id")int id){
        return songService.getSongById(id);
    }
    @PostMapping
    public int createSong(@RequestBody Song song){
        return songService.createSong(song);
    }

    @PatchMapping("/{id}")
    public Song updateSong(@PathVariable("id") int id,@RequestBody UpdateSongRequest request){
        return songService.updateSong(id,request);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable("id") int id){
        songService.deleteSong(id);
    }

    @GetMapping("/page")
    public ResponseEntity<SongPaginationResponse> getSongsByPage(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        if(page<1 || size<1){
            return ResponseEntity.badRequest().build();
        }
        SongPaginationResponse response=songService.getSongByPage(page,size);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/search")
    public ResponseEntity<SongPaginationResponse> searchSongs(

            @RequestBody SongSearchRequest request,

            @RequestParam(value = "page", defaultValue = "1") int page,

            @RequestParam(value = "size", defaultValue = "5") int size) {

        if (page < 1 || size < 1) {
            return ResponseEntity.badRequest().build();
        }

        SongPaginationResponse response =
                songService.searchSongs(request, page, size);

        return ResponseEntity.ok(response);
    }


}