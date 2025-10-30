package com.example.backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
<<<<<<< HEAD
=======
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;
>>>>>>> origin/tan

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<String> handleInvalidData(InvalidDataException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Server error: " + ex.getMessage());
    }
<<<<<<< HEAD
=======
    @ExceptionHandler(CategoryNameAlreadyExistsException.class)
    public ResponseEntity<Object> handleCategoryNameAlreadyExistsException(
            CategoryNameAlreadyExistsException ex, WebRequest request) {

        // Tạo một body JSON đơn giản cho lỗi
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Conflict");
        errorResponse.put("message", ex.getMessage());

        // Trả về HTTP 409 (CONFLICT)
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
>>>>>>> origin/tan
}
