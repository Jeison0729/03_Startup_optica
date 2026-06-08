package oft.optica.pacientes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PacienteRequest(

        @NotNull
        Integer tipoDocumento,

        @NotBlank
        String numeroDocumento,

        @NotBlank
        String nombreCompleto,

        @NotNull
        LocalDate fechaNacimiento,

        @NotBlank
        String genero,

        String estadoCivil,

        String ocupacion,

        String direccion,

        String telefono,

        Integer eps,

        String tipoVinculacion,

        @NotNull
        Integer estado


) {
}
