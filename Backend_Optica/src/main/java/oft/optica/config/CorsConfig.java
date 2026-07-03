package oft.optica.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Orígenes permitidos
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",  // Vue + Vite (desarrollo)
                "http://localhost:4200"    // Frontend servido por Nginx dentro de Docker

        ));

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // Headers que puede enviar el frontend
        config.setAllowedHeaders(List.of(
                "Authorization",          // JWT Bearer token
                "Content-Type",
                "Accept",
                "X-Requested-With"
        ));

        // Headers que el frontend puede leer de la respuesta
        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        // Permite el header Authorization (JWT)
        config.setAllowCredentials(true);

        // Cuánto tiempo el browser cachea la respuesta preflight (en segundos)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Aplica esta config a todos los endpoints
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
