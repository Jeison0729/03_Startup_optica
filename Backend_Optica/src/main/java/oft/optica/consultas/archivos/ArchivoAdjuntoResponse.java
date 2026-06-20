package oft.optica.consultas.archivos;

import java.time.LocalDateTime;

public record ArchivoAdjuntoResponse(

        Integer id,

        Integer idConsulta,

        String nombreArchivo,

        String rutaAlmacenamiento,

        String tipoContenido,

        LocalDateTime fechaSubida
) {
}
