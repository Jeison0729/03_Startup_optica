package oft.optica.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiracion-ms:3600000}")
    private long expiracionMs;

    private SecretKey getKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(String correo, List<String> roles) {
        return Jwts.builder()
                .claims(Map.of("roles", roles))   // setClaims() → claims()
                .subject(correo)                   // setSubject() → subject()
                .issuedAt(new Date())              // setIssuedAt() → issuedAt()
                .expiration(new Date(System.currentTimeMillis() + expiracionMs))
                .signWith(getKey())                // sin especificar algoritmo
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public List<String> extraerRoles(String token) {
        return extraerClaims(token).get("roles", List.class);
    }

    public boolean validarToken(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // HELPER — evita repetir el parser en cada método
    private Claims extraerClaims(String token) {
        return Jwts.parser()                       // parserBuilder() → parser()
                .verifyWith(getKey())              // setSigningKey() → verifyWith()
                .build()
                .parseSignedClaims(token)          // parseClaimsJws() → parseSignedClaims()
                .getPayload();                     // getBody() → getPayload()
    }
}