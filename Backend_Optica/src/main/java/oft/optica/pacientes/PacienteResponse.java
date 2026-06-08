package oft.optica.pacientes;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PacienteResponse(

        Integer id,

        String tipoDocumento,

        String numeroDocumento,

        String nombreCompleto,

        LocalDate fechaNacimiento,

        String genero,

        String estadoCivil,

        String ocupacion,

        String direccion,

        String telefono,

        String eps,

        String vinculacion,

        String estado,

        LocalDateTime fechaRegistro

) {
}
