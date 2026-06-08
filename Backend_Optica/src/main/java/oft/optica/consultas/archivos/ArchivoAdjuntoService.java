package oft.optica.consultas.archivos;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArchivoAdjuntoService {

    ArchivoAdjuntoResponse crear(ArchivoAdjuntoRequest request, HttpServletRequest http);

    Page<ArchivoAdjuntoResponse> listar(Integer idConsulta, Pageable pageable);

    ArchivoAdjuntoResponse buscarPorId(Integer id);

    ArchivoAdjuntoResponse actualizar(Integer id, ArchivoAdjuntoRequest request, HttpServletRequest http);

    void eliminar(Integer id, HttpServletRequest http);
}
