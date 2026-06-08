package oft.optica.consultas.mediciones;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.auditorias.AccionLog;
import oft.optica.exception.DuplicadoException;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.shared.auditoria.AuditoriaHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MedicionOptometricaServiceImpl implements MedicionOptometricaService {

    private static final String TABLA = "mediciones_optometricas";

    private final MedicionOptometricaRepository repository;
    private final MedicionOptometricaMapper mapper;
    private final MedicionOptometricaHelper helper;
    private final AuditoriaHelper auditoriaHelper;

    @Override
    @Transactional
    public MedicionOptometricaResponse crear(MedicionOptometricaRequest request, HttpServletRequest http) {

        // Una consulta solo puede tener una medición (UNIQUE en BD)
        if (repository.existsByConsultaId(request.idConsulta())) {
            throw new DuplicadoException(
                    "La consulta " + request.idConsulta() + " ya tiene una medición registrada.");
        }

        MedicionOptometricaEntity nueva = mapper.toEntity(
                request,
                helper.resolverConsulta(request.idConsulta()),
                helper.resolverMaterial(request.idMaterial()),
                helper.resolverTipoLente(request.idTipoLente())
        );

        MedicionOptometricaEntity guardada = repository.save(nueva);

        auditoriaHelper.ok(TABLA, guardada.getId(),
                AccionLog.MEDICION_CREADA,
                "Medición creada para consulta: " + request.idConsulta(), http);

        return mapper.toDTO(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicionOptometricaResponse buscarPorConsulta(Integer idConsulta) {
        return mapper.toDTO(
                repository.findByConsultaId(idConsulta)
                        .orElseThrow(() -> new RecursoNoEncontradoException(
                                "No hay medición para la consulta: " + idConsulta))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public MedicionOptometricaResponse buscarPorId(Integer id) {
        return mapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public MedicionOptometricaResponse actualizar(Integer id, MedicionOptometricaRequest request,
                                                  HttpServletRequest http) {

        MedicionOptometricaEntity existente = obtenerOFallar(id);

        mapper.updateEntity(
                existente,
                request,
                helper.resolverMaterial(request.idMaterial()),
                helper.resolverTipoLente(request.idTipoLente())
        );

        MedicionOptometricaEntity actualizada = repository.save(existente);

        auditoriaHelper.ok(TABLA, actualizada.getId(),
                AccionLog.MEDICION_ACTUALIZADA,
                "Medición actualizada para consulta: " + actualizada.getConsulta().getId(), http);

        return mapper.toDTO(actualizada);
    }

    // ── Interno ──────────────────────────────────────────────────────────────
    private MedicionOptometricaEntity obtenerOFallar(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Medición no encontrada con id: " + id));
    }
}
