package oft.optica.security.auth;

public record LoginResponse(

        Integer id,
        String token,
        String usuario,
        String roles
) {
}
