package org.example.Service;
import org.example.Dao.PlaylistSongDao;
import org.example.Dao.PlaylistDao;
import org.example.Model.Playlist;
import org.springframework.stereotype.Service;
import java.util.List;
import org.example.Model.Song;
@Service
public class PlaylistService {

    private final PlaylistDao playlistDao;

    private final PlaylistSongDao playlistSongDao;

    public  PlaylistService(PlaylistDao playlistDao,PlaylistSongDao playlistSongDao){
        this.playlistDao=playlistDao;
        this.playlistSongDao=playlistSongDao;
    }

    public int createPlaylist(int userId,String name,String description){
        if(name==null || name.trim().isEmpty()){
            throw new IllegalArgumentException("playlist name is required");
        }
        if(name.trim().length()>100){
            throw new IllegalArgumentException("playlist name cannot exceed 100 characters");
        }
        Playlist playlist = new Playlist();
        playlist.setUserId(userId);
        playlist.setName(name.trim());
       playlist.setDescription(description == null || description.trim().isEmpty() ? null : description.trim());
       return playlistDao.createPlaylist(playlist);

    }

    public List<Playlist> getUserPlaylists(int userId){
        return playlistDao.findPlaylistsByUserId(userId);
    }

    public int addSongToPlaylist(int playlistId,int songId,int userId){
        boolean playlistExists=playlistDao.existsByIdAndUserId(playlistId,userId);

        if(!playlistExists){
            throw new IllegalArgumentException("playlist not found or you don't have access to it");
        }

        return playlistSongDao.addSongToPlaylist(playlistId,songId);
    }

    public int deletePlaylist(int playlistId,int userId){
        int deletedRows=playlistDao.deletePlaylist(playlistId,userId);
        if(deletedRows==0){
            throw new IllegalArgumentException("playlist not found or you don't have access to it");
        }
        return deletedRows;
    }
    public List<Song> getSongsByPlaylistId(int playlistId, int userId) {

        boolean playlistExists =
                playlistDao.existsByIdAndUserId(playlistId, userId);

        if (!playlistExists) {
            throw new IllegalArgumentException(
                    "Playlist not found or you don't have access to it"
            );
        }

        return playlistSongDao.findSongByPlaylistId(playlistId);
    }

    public int removeSongFromPlaylist(int playlistId,int songId,int userId){
        boolean playlistExists=playlistDao.existsByIdAndUserId(playlistId,userId);

        if(!playlistExists){
            throw new IllegalArgumentException("Playlist not found or you don't have access to it ");
        }

        int deletedRows=playlistSongDao.removeSongFromPlaylist(playlistId,songId);

        if(deletedRows==0){
            throw new IllegalArgumentException("Song not found in this playlist");
        }
       return deletedRows;
    }
}
