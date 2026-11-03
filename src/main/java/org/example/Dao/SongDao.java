package org.example.Dao;
import org.example.Model.Song;
import java.util.ArrayList;
import java.util.List;
import org.example.Model.UpdateSongRequest;
import org.example.Model.SongSearchRequest;
import org.example.Model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SongDao {
    private final JdbcTemplate jdbcTemplate;

    public SongDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    public int getSongCount() {
        String sql = "SELECT COUNT(*) FROM songs";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    public List<Song> findAll(){
        String sql="Select * from songs";

        return jdbcTemplate.query(sql,(rs,rowNum)->{
            Song song=new Song();
            song.setId(rs.getInt("id"));
            song.setTitle(rs.getString("title"));
            song.setArtist(rs.getString("artist"));
            song.setAlbum(rs.getString("album"));
            song.setGenre(rs.getString("genre"));
            song.setYear(rs.getInt("year"));

            return song;
        });
    }

    public Song findById(int id){
        String sql="Select * from songs where id = ? ";

        return jdbcTemplate.queryForObject(sql,(rs,rowNum)->{
            Song song=new Song();
            song.setId(rs.getInt("id"));
            song.setTitle(rs.getString("title"));
            song.setArtist(rs.getString("artist"));
            song.setAlbum(rs.getString("album"));
            song.setGenre(rs.getString("genre"));
            song.setYear(rs.getInt("year"));

            return song;
        },id);
    }

    public int createSong(Song song) {
        String sql = "INSERT INTO songs (title,artist,album, genre, year) VALUES (?, ?, ?, ?, ?)";

        return jdbcTemplate.update(
                sql,
                song.getTitle(),
                song.getArtist(),
                song.getAlbum(),
                song.getGenre(),
                song.getYear()

        );
    }

    public int updateSong(int id, UpdateSongRequest request) {

        StringBuilder sql = new StringBuilder("UPDATE songs SET ");
        List<Object> params = new ArrayList<>();
        List<String> updates = new ArrayList<>();

        if (request.getTitle() != null) {
            updates.add("title = ?");
            params.add(request.getTitle());
        }

        if (request.getArtist() != null) {
            updates.add("artist = ?");
            params.add(request.getArtist());
        }

        if (request.getAlbum() != null) {
            updates.add("album = ?");
            params.add(request.getAlbum());
        }

        if (request.getGenre() != null) {
            updates.add("genre = ?");
            params.add(request.getGenre());
        }

        if (request.getYear() != null) {
            updates.add("year = ?");
            params.add(request.getYear());
        }

        if (updates.isEmpty()) {
            return 0;
        }

        sql.append(String.join(", ", updates));
        sql.append(" WHERE id = ?");
        params.add(id);

        return jdbcTemplate.update(sql.toString(), params.toArray());
    }
    public int deleteSong(int id){
        String sql="Delete from songs where id=?";
        return jdbcTemplate.update(sql,id);
    }

    public List<Song> findSongsByPage(int limit, int offset){
        String sql="select * from songs order by id limit ? offset ?";

        return jdbcTemplate.query(sql,(rs,rowNum)->{
            Song song=new Song();
            song.setId(rs.getInt("id"));
            song.setTitle(rs.getString("title"));
            song.setArtist(rs.getString("artist"));
            song.setAlbum(rs.getString("album"));
            song.setGenre(rs.getString("genre"));
            song.setYear(rs.getInt("year"));

            return song;
        },limit,offset);
    }

    public List<Song> searchSongs(SongSearchRequest request, int limit, int offset) {

        StringBuilder sql = new StringBuilder(
                "SELECT * FROM songs WHERE 1=1"
        );

        List<Object> params = new ArrayList<>();

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            sql.append(" AND title LIKE ?");
            params.add("%" + request.getTitle() + "%");
        }

        if (request.getArtist() != null && !request.getArtist().isBlank()) {
            sql.append(" AND artist LIKE ?");
            params.add("%" + request.getArtist() + "%");
        }

        if (request.getAlbum() != null && !request.getAlbum().isBlank()) {
            sql.append(" AND album LIKE ?");
            params.add("%" + request.getAlbum() + "%");
        }

        if (request.getGenre() != null && !request.getGenre().isBlank()) {
            sql.append(" AND genre LIKE ?");
            params.add("%" + request.getGenre() + "%");
        }

        if (request.getYear() != null) {
            sql.append(" AND year = ?");
            params.add(request.getYear());
        }

        sql.append(" ORDER BY id LIMIT ? OFFSET ?");

        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> {

            Song song = new Song();

            song.setId(rs.getInt("id"));
            song.setTitle(rs.getString("title"));
            song.setArtist(rs.getString("artist"));
            song.setAlbum(rs.getString("album"));
            song.setGenre(rs.getString("genre"));
            song.setYear(rs.getInt("year"));

            return song;

        }, params.toArray());
    }
    public int countSearchResults(SongSearchRequest request) {

        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(*) FROM songs WHERE 1=1"
        );

        List<Object> params = new ArrayList<>();

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            sql.append(" AND title LIKE ?");
            params.add("%" + request.getTitle() + "%");
        }

        if (request.getArtist() != null && !request.getArtist().isBlank()) {
            sql.append(" AND artist LIKE ?");
            params.add("%" + request.getArtist() + "%");
        }

        if (request.getAlbum() != null && !request.getAlbum().isBlank()) {
            sql.append(" AND album LIKE ?");
            params.add("%" + request.getAlbum() + "%");
        }

        if (request.getGenre() != null && !request.getGenre().isBlank()) {
            sql.append(" AND genre LIKE ?");
            params.add("%" + request.getGenre() + "%");
        }

        if (request.getYear() != null) {
            sql.append(" AND year = ?");
            params.add(request.getYear());
        }

        return jdbcTemplate.queryForObject(
                sql.toString(),
                Integer.class,
                params.toArray()
        );
    }
}
