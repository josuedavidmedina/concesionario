package com.concesionario.service;

import com.concesionario.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
public class SupabaseStorageService {

    @Value("${application.supabase.url}")
    private String supabaseUrl;

    @Value("${application.supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${application.supabase.bucket-name}")
    private String bucketName;

    private OkHttpClient client;

    @PostConstruct
    public void init() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .writeTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
                .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .build();
    }

    public String upload(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Solo se permiten archivos de imagen");
        }

        if (file.getSize() > 10_000_000) {
            throw new BadRequestException("La imagen no debe superar los 10MB");
        }

        String extension = getExtension(contentType);
        String fileName = "vehicles/" + UUID.randomUUID() + extension;

        try {
            RequestBody body = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("file", fileName,
                            RequestBody.create(file.getBytes(), MediaType.parse(contentType)))
                    .build();

            Request request = new Request.Builder()
                    .url(supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName)
                    .addHeader("Authorization", "Bearer " + serviceRoleKey)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "unknown";
                    log.error("Error subiendo archivo a Supabase: {}", errorBody);
                    throw new BadRequestException("Error al subir la imagen");
                }
            }

            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
            log.info("Imagen subida: {}", publicUrl);
            return publicUrl;
        } catch (IOException e) {
            log.error("Error de IO al subir imagen", e);
            throw new BadRequestException("Error al subir la imagen: " + e.getMessage());
        }
    }

    public void delete(String url) {
        try {
            String objectPath = extractObjectPath(url);
            if (objectPath == null) return;

            Request request = new Request.Builder()
                    .url(supabaseUrl + "/storage/v1/object/" + bucketName + "/" + objectPath)
                    .addHeader("Authorization", "Bearer " + serviceRoleKey)
                    .delete()
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    log.warn("Error eliminando archivo de Supabase: {}", response.code());
                }
            }
        } catch (IOException e) {
            log.error("Error eliminando imagen", e);
        }
    }

    private String extractObjectPath(String url) {
        String prefix = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/";
        if (url.startsWith(prefix)) {
            return url.substring(prefix.length());
        }
        return null;
    }

    private String getExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
