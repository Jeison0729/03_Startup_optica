package oft.optica.auditorias;

import java.time.LocalDateTime;

public record LogAuditoriaResponse(

        Integer id,

        String tablaAfectada,

        Integer registro,

        Integer usuario,

        String usuarioNombre,

        String ip,

        String accion,

        String detalle,

        LocalDateTime fechaEvento,

        Byte resultado
) {
}
