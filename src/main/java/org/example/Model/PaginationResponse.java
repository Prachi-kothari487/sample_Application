package org.example.Model;
import java.util.List;
public class PaginationResponse {

    private List<UserResponse> users;
    private int currentPage;
    private int pageSize;
    private int totalUsers;
    private int totalPages;

    public PaginationResponse(){}

    public PaginationResponse(List<UserResponse> users,int currentPage,int pageSize,int totalUsers,int totalPages){
        this.users=users;
        this.currentPage=currentPage;
        this.pageSize=pageSize;
        this.totalUsers=totalUsers;
        this.totalPages=totalPages;
    }

    public List<UserResponse> getUsers() {
        return users;
    }

    public void setUsers(List<UserResponse> users) {
        this.users = users;
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

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
