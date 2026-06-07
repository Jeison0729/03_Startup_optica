package oft.optica.security.auth;

import jakarta.validation.constraints.NotBlank;


public record LoginRequest(

        @NotBlank(message = "El correo es obligatorio")
        String correoElectronico,

        @NotBlank(message = "La contraseña es obligatoria")
        String contrasena
) {
}