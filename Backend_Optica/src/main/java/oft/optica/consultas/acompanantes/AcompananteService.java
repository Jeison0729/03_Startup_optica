package oft.optica.consultas.acompanantes;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AcompananteService {

    AcompananteResponse crear(AcompananteRequest request, HttpServletRequest http);

    Page<AcompananteResponse> listar(Integer idConsulta, Pageable pageable);

    AcompananteResponse buscarPorId(Integer id);

    AcompananteResponse actualizar(Integer id, AcompananteRequest request, HttpServletRequest http);

    void eliminar(Integer id, HttpServletRequest http);
}
