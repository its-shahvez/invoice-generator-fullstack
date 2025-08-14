package in.shahvez.invoicegeneratorapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Hamare custom CORS configuration ka istemaal karein
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints (in sab par security nahi lagegi)
                        .requestMatchers("/api/invoices/hello", "/api/webhooks/**").permitAll()
                        // Baaki sabhi invoice endpoints protected hain (login zaroori hai)
                        .requestMatchers("/api/invoices/**").authenticated()
                        // Koi aur anjaan request ko block karein
                        .anyRequest().denyAll()
                )
                // JWT validation ko chalu karein
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        // CSRF ko disable karein (JWTs ke liye zaroori hai)
        http.csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // === YAHAN APNI NETLIFY URL DAALEIN ===
        // Apne live frontend URL ko yahan add karein
        configuration.setAllowedOrigins(List.of("https://invoicegeneratorweb.netlify.app", "http://localhost:5173"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}