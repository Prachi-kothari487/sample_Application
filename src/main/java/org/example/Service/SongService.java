package org.example.Service;
import org.example.Model.Song;
import org.example.Dao.SongDao;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.example.Model.UpdateSongRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.example.Model.SongPaginationResponse;
import org.example.Model.SongSearchRequest;
@Service
public class SongService {
    private final SongDao songDao;


    public SongService(SongDao songDao){
        this.songDao=songDao;

    }

    public List<Song> getAllSongs(){
        return songDao.findAll();
    }

    public Song getSongById(int id){
        return songDao.findById(id);
    }

    public int createSong(Song song){
        return songDao.createSong(song);
    }
    public Song updateSong(int id, UpdateSongRequest request) {

        // 1. Validate that at least one field is provided
        if (request.getTitle() == null &&
                request.getArtist() == null &&
                request.getAlbum() == null &&
                request.getGenre() == null &&
                request.getYear() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one field is required to update"
            );
        }

        // 2. Check whether the song exists
        try {
            songDao.findById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Song not found"
            );
        }

        // 3. Update the song
        songDao.updateSong(id, request);

        // 4. Return the updated song
        return songDao.findById(id);
    }
    public void deleteSong(int id) {

        try {
            songDao.findById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Song not found"
            );
        }

        songDao.deleteSong(id);
    }

    public SongPaginationResponse getSongByPage(int page,int size){
        int offset=(page-1)*size;

        List<Song> songs= songDao.findSongsByPage(size,offset);
        int totalSongs=songDao.getSongCount();
        int totalPages=(int) Math.ceil((double) totalSongs/size);

        return new SongPaginationResponse(songs,page,size,totalSongs,totalPages);
    }
    public SongPaginationResponse searchSongs(
            SongSearchRequest request,
            int page,
            int size) {

        int offset = (page - 1) * size;

        // Fetch matching songs for the requested page
        List<Song> songs = songDao.searchSongs(request, size, offset);

        // Count all matching songs
        int totalSongs = songDao.countSearchResults(request);

        // Calculate total pages
        int totalPages = (int) Math.ceil((double) totalSongs / size);

        return new SongPaginationResponse(
                songs,
                page,
                size,
                totalSongs,
                totalPages
        );
    }
    }

