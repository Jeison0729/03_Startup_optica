package oft.optica.auditorias;

import org.springframework.stereotype.Component;

@Component
public class LogAuditoriaMapper {

    public LogAuditoriaResponse toDTO(LogAuditoriaEntity log) {
        return new LogAuditoriaResponse(
                log.getId(),
                log.getTablaAfectada(),
                log.getRegistro(),
                log.getUsuario() != null ? log.getUsuario().getId() : null,
                log.getUsuarioNombre(),
                log.getIp(),
                log.getAccion(),
                log.getDetalle(),
                log.getFechaEvento(),
                log.getResultado()
        );
    }
}
