package oft.optica.consultas.archivos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArchivoAdjuntoRequest(

        @NotNull(message = "Número de consulta requerido.")
        Integer idConsulta,

        @NotBlank(message = "Nombre de archivo obligatorio.")
        String nombreArchivo,

        @NotBlank(message = "Ruta de almacenamiento requerido")
        String rutaAlmacenamiento,

        String tipoContenido
) {
}
