
package org.example.Dao;

import org.example.Model.Playlist;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class PlaylistDao {

    private final JdbcTemplate jdbcTemplate;

    public PlaylistDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Playlist> playlistRowMapper = (rs, rowNum) -> {

        Playlist playlist = new Playlist();

        playlist.setId(rs.getInt("id"));
        playlist.setUserId(rs.getInt("user_id"));
        playlist.setName(rs.getString("name"));
        playlist.setDescription(rs.getString("description"));
        playlist.setCreatedAt(rs.getTimestamp("created_at"));

        return playlist;
    };

    public int createPlaylist(Playlist playlist) {

        String sql = """
            INSERT INTO playlists (user_id, name, description)
            VALUES (?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            ps.setInt(1, playlist.getUserId());
            ps.setString(2, playlist.getName());
            ps.setString(3, playlist.getDescription());

            return ps;

        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    public List<Playlist> findPlaylistsByUserId(int userId) {

        String sql = """
            SELECT * FROM playlists
            WHERE user_id = ?
            ORDER BY created_at DESC
            """;

        return jdbcTemplate.query(sql, playlistRowMapper, userId);
    }

    public int deletePlaylist(int playlistId, int userId) {

        String sql = """
            DELETE FROM playlists
            WHERE id = ? AND user_id = ?
            """;

        return jdbcTemplate.update(sql, playlistId, userId);
    }
    public boolean existsByIdAndUserId(int playlistId,int userId){
        String sql= """
                select count(*) from playlists where id=? and user_id=?
                """;

        Integer count=jdbcTemplate.queryForObject(sql,Integer.class,playlistId,userId);
        return count!=null && count> 0;
    }
}
