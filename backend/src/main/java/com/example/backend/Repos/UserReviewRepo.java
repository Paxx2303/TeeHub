package com.example.backend.Repos;

import com.example.backend.Entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {

}
