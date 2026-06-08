package oft.optica.consultas.acompanantes;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.auditorias.AccionLog;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.shared.auditoria.AuditoriaHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcompananteServiceImpl implements AcompananteService {

    private static final String TABLA = "acompanates";

    private final AcompananteRepository acompananteRepository;
    private final AcompananteMapper acompananteMapper;
    private final AcompananteHelper acompananteHelper;
    private final AuditoriaHelper auditoriaHelper;

    @Override
    @Transactional
    public AcompananteResponse crear(AcompananteRequest request, HttpServletRequest http) {

        AcompananteEntity nuevo = acompananteMapper.toEntity(
                request,
                acompananteHelper.resolverConsulta(request.idConsulta()),
                acompananteHelper.resolverParentesco(request.parentesco())
        );

        AcompananteEntity guardado = acompananteRepository.save(nuevo);

        auditoriaHelper.ok(TABLA, guardado.getId(),
                AccionLog.ACOMPANANTE_CREADO,
                "Acompañante creado: " + guardado.getNombre(), http);

        return acompananteMapper.toDTO(guardado);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<AcompananteResponse> listar(Integer idConsulta, Pageable pageable) {

        List<AcompananteResponse> lista = acompananteRepository
                .findByConsultaId(idConsulta)
                .stream()
                .map(acompananteMapper::toDTO)
                .toList();

        return new PageImpl<>(lista, pageable, lista.size());
    }

    @Override
    @Transactional(readOnly = true)
    public AcompananteResponse buscarPorId(Integer id) {
        return acompananteMapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public AcompananteResponse actualizar(
            Integer id,
            AcompananteRequest request,
            HttpServletRequest http) {

        AcompananteEntity existente = obtenerOFallar(id);

        existente.setNombre(request.nombre());
        existente.setTelefono(request.telefono());
        existente.setParentesco(acompananteHelper.resolverParentesco(request.parentesco()));

        AcompananteEntity actualizado = acompananteRepository.save(existente);

        auditoriaHelper.ok(TABLA, actualizado.getId(),
                AccionLog.ACOMPANANTE_ACTUALIZADO,
                "Acompañante actualizado: " + actualizado.getNombre(), http);

        return acompananteMapper.toDTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Integer id, HttpServletRequest http) {

        AcompananteEntity acompanante = obtenerOFallar(id);

        acompananteRepository.delete(acompanante);

        auditoriaHelper.ok(TABLA, id,
                AccionLog.ACOMPANANTE_ELIMINADO,
                "Acompañante eliminado: " + acompanante.getNombre(), http);
    }

    // ── Interno ──────────────────────────────────────────────────────────────
    private AcompananteEntity obtenerOFallar(Integer id) {
        return acompananteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Acompañante no encontrado con id: " + id));
    }
}
