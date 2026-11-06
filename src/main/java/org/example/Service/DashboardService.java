
package org.example.Service;

import org.example.Dao.SongDao;
import org.example.Dao.UserDao;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final SongDao songDao;
    private final UserDao userDao;

    public DashboardService(SongDao songDao, UserDao userDao) {
        this.songDao = songDao;
        this.userDao = userDao;
    }

    public Map<String, Object> getDashboardSummary() {

        Map<String, Object> summary = new LinkedHashMap<>();

        // Dashboard statistics
        summary.put("totalUsers", userDao.getUserCount());
        summary.put("activeUsers", userDao.getActiveUserCount());
        summary.put("totalSongs", songDao.getSongCount());
        summary.put("totalGenres", songDao.getGenreCount());

        // Chart data
        summary.put("songsByGenre", songDao.getSongsByGenre());

        // Recently added songs
        summary.put("recentSongs", songDao.getRecentSongs());

        return summary;
    }
}
