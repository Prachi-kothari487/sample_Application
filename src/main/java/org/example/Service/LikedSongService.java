package org.example.Service;
import org.example.Dao.LikedSongDao;
import org.example.Model.LikedSong;
import org.example.Model.Song;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class LikedSongService {
    private final LikedSongDao likedSongDao;
    public LikedSongService(LikedSongDao likedSongDao){
        this.likedSongDao=likedSongDao;
    }

    public int likeSong(int userId,int songId){
        return likedSongDao.likeSong(userId,songId);
    }

    public List<Song> getLikedSongs(int userId){
        return likedSongDao.findLikedSongsByUserId(userId);
    }

    public int unlikeSong(int userId,int songId){
        int deletedRows=likedSongDao.unlikeSong(userId,songId);

        if (deletedRows==0){
            throw new IllegalArgumentException("Song is not in your liked songs");
        }
        return deletedRows;
    }
}
