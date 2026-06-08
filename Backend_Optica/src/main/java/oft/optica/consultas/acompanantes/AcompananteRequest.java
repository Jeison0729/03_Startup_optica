package oft.optica.consultas.acompanantes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AcompananteRequest(

        @NotNull(message = "Codigo de Consulta requerida")
        Integer idConsulta,

        @NotBlank(message = "Nombre de acompañante requerido.")
        String nombre,

        Integer parentesco,

        String telefono
) {
}
