package com.episteme.api.repository;

import com.episteme.api.entity.Post;
import com.episteme.api.entity.dto.PostDto;
import com.episteme.api.entity.enums.PostStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("select p from Post p where p.user.userId = ?1")
    List<Post> findAllPostByUserId(String userId);
    @Query("select o  from Post o where  o.title like %?1% or o.summary like %?1%")
    List<Post> findByKeywords(String keywords);

    @Query("select p from Post p where p.slug = ?1")
    Optional<Post> findBySlug(String slug);
    List<Post> findByStatus(PostStatus postStatus);

    @Query("select p from Post p where p.user.userId = ?1")
    Page<Post> findPostsByUserId(String userId,Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "update post p set p.view = p.view + 1 where p.post_id = ?1", nativeQuery = true)
    void autoIncreaseViews(Long postId);

    @Query("select o from Post o where o.status= 'Published' and o.createAt >= CURRENT_DATE - 7 ORDER BY o.createAt DESC")
    Page<Post> findPostByNewest(Pageable pageable);
    @Query("SELECT o FROM Post o where o.status= 'Published' GROUP BY o.postId ORDER BY o.view DESC")
    Page<Post> findPostsPopular(Pageable pageable);

    @Query("SELECT o FROM Post o WHERE o.status = 'Draft'")
    Page<Post> findPostsByStatusDraft(String userId, Pageable pageable);

    @Query(value="SELECT * FROM Post p where p.status like 'Published'", nativeQuery = true)
    List<Post> findAll();

    @Query(value="SELECT * FROM Post p where p.status like 'Published'", nativeQuery = true)
    Page<Post> findAll(Pageable pageable);

    @Query("SELECT p FROM Post p")
    List<Post> findAllForAdmin();
    // Query 6/8 api
    @Query("SELECT COUNT(p.postId) FROM Post p WHERE p.createAt >= :startDate AND p.createAt < :endDate")
    Integer countPostByPostDate(LocalDateTime startDate, LocalDateTime endDate);
    @Query("select sum(p.view) from Post p where p.user.userId = ?1 ")
    Integer sumPostsViewOfUser(String id);

    @Query("select count (p.user.userId) from Post p where p.user.userId = ?1 ")
    Integer numberPostsOfUser(String id);
}
