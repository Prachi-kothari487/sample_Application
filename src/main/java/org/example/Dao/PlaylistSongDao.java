package org.example.Dao;
import org.example.Model.Song;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PlaylistSongDao {

    private final JdbcTemplate jdbcTemplate;

    public PlaylistSongDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }
    private final RowMapper<Song> songRowMapper=(rs,rowNum)->{
        Song song=new Song();
        song.setId(rs.getInt("id"));
        song.setTitle(rs.getString("title"));
        song.setArtist(rs.getString("artist"));
        song.setAlbum(rs.getString("album"));
        song.setGenre(rs.getString("genre"));
        song.setYear(rs.getInt("year"));
        return song;
    };
    public int addSongToPlaylist(int playlistId,int songId){
        String sql= """
                insert into playlist_songs(playlist_id,song_id) values (?,?)
                """;
        return jdbcTemplate.update(sql,playlistId,songId);
    }
    public List<Song> findSongByPlaylistId(int playlistId){
        String sql= """
                select s.* from songs s inner join playlist_songs ps on s.id=ps.song_id where ps.playlist_id=? order by ps.added_at desc
                """;

        return jdbcTemplate.query(sql,songRowMapper,playlistId);
    }
    public int removeSongFromPlaylist(int playlistId,int songId){
        String sql= """
                delete from playlist_songs where playlist_id=? and song_id=?
                """;

        return jdbcTemplate.update(sql,playlistId,songId);
    }
}
