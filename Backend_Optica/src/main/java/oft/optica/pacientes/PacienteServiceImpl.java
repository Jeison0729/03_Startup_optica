package oft.optica.pacientes;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.auditorias.AccionLog;
import oft.optica.exception.DuplicadoException;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.shared.auditoria.AuditoriaHelper;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PacienteServiceImpl implements PacienteService {

    private static final String TABLA = "pacientes";

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;
    private final PacienteHelper pacienteHelper;
    private final AuditoriaHelper auditoriaHelper;


    @Override
    @Transactional
    public PacienteResponse crear(PacienteRequest request, HttpServletRequest http) {

        if (pacienteRepository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new DuplicadoException(
                    "Ya existe un paciente con el documento: " + request.numeroDocumento());
        }

        PacienteEntity guardado = pacienteRepository.save(
                pacienteMapper.toEntity(
                        request,
                        pacienteHelper.resolverTipoDocumento(request.tipoDocumento()),
                        pacienteHelper.resolverEps(request.eps()),
                        pacienteHelper.resolverEstado(request.estado())
                )
        );

        auditoriaHelper.ok(TABLA, guardado.getId(),
                AccionLog.PACIENTE_CREADO,
                "Paciente creado: " + guardado.getNombreCompleto(), http);

        return pacienteMapper.toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PacienteResponse> listar(String nombreCompleto, String numeroDocumento,
                                         Integer idEstado, Pageable pageable) {
        return pacienteRepository
                .buscarConFiltros(nombreCompleto, numeroDocumento, idEstado, pageable)
                .map(pacienteMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PacienteResponse buscarPorId(Integer id) {
        return pacienteMapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public PacienteResponse actualizar(Integer id, PacienteRequest request,
                                       HttpServletRequest http) {

        PacienteEntity existente = obtenerOFallar(id);

        if (!existente.getNumeroDocumento().equals(request.numeroDocumento()) &&
                pacienteRepository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new DuplicadoException(
                    "Ya existe un paciente con el documento: " + request.numeroDocumento());
        }

        pacienteMapper.updateEntity(
                existente, request,
                pacienteHelper.resolverTipoDocumento(request.tipoDocumento()),
                pacienteHelper.resolverEps(request.eps()),
                pacienteHelper.resolverEstado(request.estado())
        );

        PacienteEntity actualizado = pacienteRepository.save(existente);

        auditoriaHelper.ok(TABLA, actualizado.getId(),
                AccionLog.PACIENTE_ACTUALIZADO,
                "Paciente actualizado: " + actualizado.getNombreCompleto(), http);

        return pacienteMapper.toDTO(actualizado);
    }

    @Override
    @Transactional
    public PacienteResponse cambiarEstado(Integer id, CambiarEstadoRequest request,
                                          HttpServletRequest http) {

        PacienteEntity paciente = obtenerOFallar(id);
        paciente.setEstado(pacienteHelper.resolverEstado(request.idEstado()));

        PacienteEntity actualizado = pacienteRepository.save(paciente);

        auditoriaHelper.ok(TABLA, actualizado.getId(),
                AccionLog.PACIENTE_ESTADO_CAMBIADO,
                "Estado cambiado a: " + actualizado.getEstado().getCodigo(), http);

        return pacienteMapper.toDTO(actualizado);
    }

    private PacienteEntity obtenerOFallar(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Paciente no encontrado con id: " + id));
    }
}