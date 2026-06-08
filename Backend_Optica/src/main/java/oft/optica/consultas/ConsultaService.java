package oft.optica.consultas;

import jakarta.servlet.http.HttpServletRequest;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface ConsultaService {

    ConsultaResponse crear(ConsultaRequest request, HttpServletRequest http);

    Page<ConsultaResponse> listar(Integer idPaciente, Integer idEstado,
                                  LocalDateTime desde, LocalDateTime hasta,
                                  Pageable pageable);

    ConsultaResponse buscarPorId(Integer id);

    ConsultaResponse actualizar(Integer id, ConsultaRequest request, HttpServletRequest http);

    ConsultaResponse cambiarEstado(Integer id, CambiarEstadoRequest request, HttpServletRequest http);
}
