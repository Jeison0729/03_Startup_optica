package oft.optica.consultas.archivos;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ArchivoAdjuntoService {

    ArchivoAdjuntoResponse crear(Integer idConsulta, MultipartFile archivo, HttpServletRequest http);

    Page<ArchivoAdjuntoResponse> listar(Integer idConsulta, Pageable pageable);

    ArchivoAdjuntoResponse buscarPorId(Integer id);

    void eliminar(Integer id, HttpServletRequest http);

    String obtenerUrl(Integer id);
}
