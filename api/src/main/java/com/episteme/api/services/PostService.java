package com.episteme.api.services;

import com.episteme.api.entity.dto.NumberCreate;
import com.episteme.api.entity.dto.NumberRegister;
import com.episteme.api.entity.dto.PostDto;
import com.episteme.api.response.PostResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public interface PostService extends IService<PostDto, Long> {
    PostResponse getAllPosts(Integer pageNumber,Integer pageSize, String sortBy, String sortDir);
    PostResponse findAllDraftByUserId(String userId, Integer pageNumber, Integer pageSize, String sortBy, String sortDir);
    Integer sumPostsViewOfUser(String id);
    Integer numberPostsOfUser(String id);
    Integer numberCreateAtNow();
    NumberCreate numberCreate(LocalDate startDate, LocalDate endDate);
}
