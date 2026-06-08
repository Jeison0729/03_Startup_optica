package oft.optica.consultas;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.auditorias.AccionLog;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.shared.auditoria.AuditoriaHelper;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConsultaServiceImpl implements ConsultaService {

    private static final String TABLA = "consultas";

    private final ConsultaRepository consultaRepository;
    private final ConsultaMapper consultaMapper;
    private final ConsultaHelper consultaHelper;
    private final AuditoriaHelper auditoriaHelper;

    @Override
    @Transactional
    public ConsultaResponse crear(ConsultaRequest request, HttpServletRequest http) {

        ConsultaEntity nueva = consultaMapper.toEntity(
                request,
                consultaHelper.resolverPaciente(request.paciente()),
                consultaHelper.resolverOptometra(request.optometra()),
                consultaHelper.resolverEstado(request.estado())
        );

        ConsultaEntity guardada = consultaRepository.save(nueva);

        auditoriaHelper.ok(TABLA, guardada.getId(),
                AccionLog.CONSULTA_CREADA,
                "Consulta creada para paciente: " + guardada.getPaciente().getNombreCompleto(),
                http);

        return consultaMapper.toDTO(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConsultaResponse> listar(Integer idPaciente, Integer idEstado,
                                         LocalDateTime desde, LocalDateTime hasta,
                                         Pageable pageable) {
        return consultaRepository
                .buscarConFiltros(idPaciente, idEstado, desde, hasta, pageable)
                .map(consultaMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ConsultaResponse buscarPorId(Integer id) {
        return consultaMapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public ConsultaResponse actualizar(Integer id, ConsultaRequest request,
                                       HttpServletRequest http) {

        ConsultaEntity existente = obtenerOFallar(id);

        consultaMapper.updateEntity(
                existente,
                request,
                consultaHelper.resolverPaciente(request.paciente()),
                consultaHelper.resolverOptometra(request.optometra()),
                consultaHelper.resolverEstado(request.estado())
        );

        ConsultaEntity actualizada = consultaRepository.save(existente);

        auditoriaHelper.ok(TABLA, actualizada.getId(),
                AccionLog.CONSULTA_ACTUALIZADA,
                "Consulta actualizada para paciente: " + actualizada.getPaciente().getNombreCompleto(),
                http);

        return consultaMapper.toDTO(actualizada);
    }

    @Override
    @Transactional
    public ConsultaResponse cambiarEstado(Integer id, CambiarEstadoRequest request,
                                          HttpServletRequest http) {

        ConsultaEntity consulta = obtenerOFallar(id);
        String estadoAnterior = consulta.getEstado().getCodigo();

        consulta.setEstado(consultaHelper.resolverEstado(request.idEstado()));

        // Si pasa a FINALIZADA, registra fecha de cierre automáticamente
        if ("FINALIZADA".equals(consulta.getEstado().getCodigo())) {
            consulta.setFechaCierre(LocalDateTime.now());
        }

        ConsultaEntity actualizada = consultaRepository.save(consulta);

        AccionLog accion = switch (actualizada.getEstado().getCodigo()) {
            case "FINALIZADA" -> AccionLog.CONSULTA_FINALIZADA;
            case "ANULADA" -> AccionLog.CONSULTA_ANULADA;
            default -> AccionLog.CONSULTA_ACTUALIZADA;
        };

        auditoriaHelper.ok(TABLA, actualizada.getId(),
                accion,
                "Estado cambiado de " + estadoAnterior + " a " + actualizada.getEstado().getCodigo(),
                http);

        return consultaMapper.toDTO(actualizada);
    }

    // ── Interno ──────────────────────────────────────────────────────────────
    private ConsultaEntity obtenerOFallar(Integer id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Consulta no encontrada con id: " + id));
    }
}
