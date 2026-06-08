package oft.optica.pacientes;

import jakarta.servlet.http.HttpServletRequest;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PacienteService {

    PacienteResponse crear(PacienteRequest request, HttpServletRequest http);

    Page<PacienteResponse> listar(
            String nombreCompleto, String numeroDocumento, Integer idEstado, Pageable pageable);

    PacienteResponse buscarPorId(Integer id);

    PacienteResponse actualizar(Integer id, PacienteRequest request, HttpServletRequest http);

    PacienteResponse cambiarEstado(Integer id, CambiarEstadoRequest request, HttpServletRequest http);
}

