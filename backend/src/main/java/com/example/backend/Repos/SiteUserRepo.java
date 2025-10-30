package com.example.backend.Repos;

import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteUserRepo extends JpaRepository<SiteUser, Integer> {

    // [SỬA LỖI 409] Buộc tìm kiếm bằng chữ thường (khớp với logic Service)
    @Query("SELECT u FROM SiteUser u WHERE LOWER(u.emailAddress) = LOWER(:emailAddress)")
    Optional<SiteUser> findByEmailAddress(@Param("emailAddress") String emailAddress);

    // [SỬA LỖI 409] Buộc kiểm tra tồn tại bằng chữ thường (khớp với logic Service)
    // Spring Data JPA sẽ tự động triển khai phương thức này dựa trên Query
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM SiteUser u WHERE LOWER(u.emailAddress) = LOWER(:emailAddress)")
    boolean existsByEmailAddress(@Param("emailAddress") String emailAddress);

    @Query("""
        select new com.example.backend.DTO.Response.SiteUserResponse(
            su.id,
            su.fullName,
            su.userAvatar,
            su.emailAddress,
            su.phoneNumber,
            su.role
        )
        from SiteUser su
        order by su.id desc
    """)
    List<SiteUserResponse> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.SiteUserResponse(
            su.id,
            su.fullName,
            su.userAvatar,
            su.emailAddress,
            su.phoneNumber,
            su.role
        )
        from SiteUser su
        where su.id = :id
    """)
    Optional<SiteUserResponse> findDtoById(@Param("id") Integer id);

    @Query("""
        select new com.example.backend.DTO.Response.SiteUserResponse(
            su.id,
            su.fullName,
            su.userAvatar,
            su.emailAddress,
            su.phoneNumber,
            su.role
        )
        from SiteUser su
        where lower(su.emailAddress) like lower(concat('%', :kw, '%'))
           or lower(su.fullName)     like lower(concat('%', :kw, '%'))
           or lower(su.phoneNumber)  like lower(concat('%', :kw, '%'))
        order by su.id desc
    """)
    List<SiteUserResponse> searchAsDto(@Param("kw") String keyword);
}
