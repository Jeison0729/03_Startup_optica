package oft.optica.auditorias;

import oft.optica.accesos.usuario.UsuarioEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface LogAuditoriaService {

    void registrar(UsuarioEntity usuario,
                   String tablaAfectada,
                   Integer idRegistro,
                   AccionLog accion,
                   String detalle,
                   String ip,
                   boolean exito);

    Page<LogAuditoriaResponse> listarConFiltros(
            String tablaAfectada,
            Integer registro,
            Integer usuario,
            String accion,
            Byte resultado,
            LocalDateTime desde,
            LocalDateTime hasta,
            Pageable pageable);
}
