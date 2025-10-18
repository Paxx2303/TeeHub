package com.example.backend.Controller;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Service.SiteUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final SiteUserService service;

    @GetMapping
    public ResponseEntity<List<SiteUserResponse>> getAll(@RequestParam(value = "q", required = false) String q) {
        var list = (q == null) ? service.getAllUsers() : service.searchUsers(q);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiteUserResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<SiteUserResponse> create(
            @RequestBody @Validated(SiteUserRequest.Create.class) SiteUserRequest req) {
        var created = service.createUser(req);
        return ResponseEntity.created(URI.create("/api/users/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiteUserResponse> update(
            @PathVariable Integer id,
            @RequestBody @Validated(SiteUserRequest.Update.class) SiteUserRequest req) {
        return ResponseEntity.ok(service.updateUser(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
