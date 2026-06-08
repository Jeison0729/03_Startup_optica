package oft.optica.consultas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConsultaRequest(

        @NotNull(message = "Paciente no puede ir vacío.") Integer paciente,

        @NotNull(message = "Optometra no puede ir vacio.") Integer optometra,

        @NotBlank(message = "Motivo consulta no puede estar vacio") String motivoConsulta,

        String ultimoControl,

        String antecedentes,

        String examenExterno,

        String tonometriaOd,

        String tonometriaOi,

        String testColor,

        String fondoOjo,

        String diagnostico,

        String conducta,

        String controlSugerido,

        String remision,

        @NotNull(message = "Estado no puede ir vacio.") Integer estado,

        LocalDateTime fechaCierre

) {
}
