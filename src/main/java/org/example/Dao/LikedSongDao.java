
package org.example.Dao;

import org.example.Model.Song;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LikedSongDao {

    private final JdbcTemplate jdbcTemplate;

    public LikedSongDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Song> songRowMapper = (rs, rowNum) -> {

        Song song = new Song();

        song.setId(rs.getInt("id"));
        song.setTitle(rs.getString("title"));
        song.setArtist(rs.getString("artist"));
        song.setAlbum(rs.getString("album"));
        song.setGenre(rs.getString("genre"));
        song.setYear(rs.getInt("year"));

        return song;
    };

    public int likeSong(int userId, int songId) {

        String sql = """
                INSERT INTO liked_songs (user_id, song_id)
                VALUES (?, ?)
                """;

        return jdbcTemplate.update(sql, userId, songId);
    }

    public List<Song> findLikedSongsByUserId(int userId) {

        String sql = """
                SELECT s.*
                FROM songs s
                INNER JOIN liked_songs ls
                ON s.id = ls.song_id
                WHERE ls.user_id = ?
                ORDER BY ls.created_at DESC
                """;

        return jdbcTemplate.query(sql, songRowMapper, userId);
    }

    public int unlikeSong(int userId, int songId) {

        String sql = """
                DELETE FROM liked_songs
                WHERE user_id = ? AND song_id = ?
                """;

        return jdbcTemplate.update(sql, userId, songId);
    }
}
