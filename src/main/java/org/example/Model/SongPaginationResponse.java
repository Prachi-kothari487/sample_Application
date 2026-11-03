package org.example.Model;
import java.util.List;
public class SongPaginationResponse {
    private List<Song> songs;
    private int currentPage;
    private int pageSize;
    private int totalSongs;
    private int totalPages;

    public SongPaginationResponse() {
    }

    public SongPaginationResponse(List<Song> songs, int currentPage,
                                  int pageSize, int totalSongs, int totalPages) {
        this.songs = songs;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalSongs = totalSongs;
        this.totalPages = totalPages;
    }

    public List<Song> getSongs() {
        return songs;
    }

    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalSongs() {
        return totalSongs;
    }

    public void setTotalSongs(int totalSongs) {
        this.totalSongs = totalSongs;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }




}
