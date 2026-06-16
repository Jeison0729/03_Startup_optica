package oft.optica.auditorias;

import lombok.RequiredArgsConstructor;
import oft.optica.accesos.usuario.UsuarioEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LogAuditoriaServiceImpl implements LogAuditoriaService {

    private final LogAuditoriaRepository repository;
    private final LogAuditoriaMapper mapper;

    @Override
    public void registrar(UsuarioEntity usuario,
                          String tablaAfectada,
                          Integer idRegistro,
                          AccionLog accion,
                          String detalle,
                          String ip,
                          boolean exito) {
        repository.save(LogAuditoriaEntity.builder()
                .tablaAfectada(tablaAfectada)
                .registro(idRegistro)
                .usuario(usuario)
                .usuarioNombre(usuario != null ? usuario.getUsuarioNombre() : "Sistema")
                .accion(accion.name())
                .detalle(detalle)
                .ip(ip)
                .resultado(exito ? (byte) 1 : (byte) 0)
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LogAuditoriaResponse> listarConFiltros(
            String tablaAfectada, Integer registro, Integer idUsuario,
            String accion, Byte resultado, LocalDateTime desde, LocalDateTime hasta, Pageable pageable) {

        return repository.findAll(
                        LogAuditoriaSpecification.conFiltros(tablaAfectada, registro, idUsuario, accion, resultado, desde, hasta),
                        pageable)
                .map(mapper::toDTO);
    }
}
