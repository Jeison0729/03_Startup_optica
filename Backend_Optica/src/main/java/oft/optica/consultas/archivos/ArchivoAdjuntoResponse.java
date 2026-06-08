package oft.optica.consultas.archivos;

import java.time.LocalDateTime;

public record ArchivoAdjuntoResponse(

        Integer id,

        Integer idCnsulta,

        String nombreArchivo,

        String rutaAlmacenamiento,

        String tipoContenido,

        LocalDateTime fechaSubida
) {
}
