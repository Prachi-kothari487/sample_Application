package org.example.Model;

public class BaseEntity {

    private Long id;
    private Boolean isActive = true;
    private Boolean isDelete = false;
    private Long cratedAt;
    private Long UpdateAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getDelete() {
        return isDelete;
    }

    public void setDelete(Boolean delete) {
        isDelete = delete;
    }

    public Long getCratedAt() {
        return cratedAt;
    }

    public void setCratedAt(Long cratedAt) {
        this.cratedAt = cratedAt;
    }

    public Long getUpdateAt() {
        return UpdateAt;
    }

    public void setUpdateAt(Long updateAt) {
        UpdateAt = updateAt;
    }
}
