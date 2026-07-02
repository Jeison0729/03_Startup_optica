package oft.optica.consultas.archivos;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.auditorias.AccionLog;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.shared.auditoria.AuditoriaHelper;
import oft.optica.shared.storage.StorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArchivoAdjuntoServiceImpl implements ArchivoAdjuntoService {

    private static final String TABLA = "archivos_adjuntos";

    private final ArchivoAdjuntoRepository repository;
    private final ArchivoAdjuntoMapper mapper;
    private final ArchivoAdjuntoHelper helper;
    private final AuditoriaHelper auditoriaHelper;
    private final StorageService storageService;


    @Override
    @Transactional
    public ArchivoAdjuntoResponse crear(Integer idConsulta, MultipartFile archivo, HttpServletRequest http) {

        String key = "consultas/" + idConsulta + "/" + UUID.randomUUID() + "_" + archivo.getOriginalFilename();

        storageService.subirArchivo(archivo, key);

        ArchivoAdjuntoEntity nuevo = ArchivoAdjuntoEntity.builder()
                .consulta(helper.resolverConsulta(idConsulta))
                .nombreArchivo(archivo.getOriginalFilename())
                .rutaAlmacenamiento(key)
                .tipoContenido(archivo.getContentType())
                .build();

        ArchivoAdjuntoEntity guardado = repository.save(nuevo);

        auditoriaHelper.ok(TABLA, guardado.getId(),
                AccionLog.ARCHIVO_SUBIDO,
                "Archivo cargado: " + guardado.getNombreArchivo(), http);

        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArchivoAdjuntoResponse> listar(Integer idConsulta, Pageable pageable) {
        List<ArchivoAdjuntoResponse> lista = repository.findByConsultaId(idConsulta)
                .stream()
                .map(mapper::toDTO)
                .toList();

        return new PageImpl<>(lista, pageable, lista.size());
    }

    @Override
    @Transactional(readOnly = true)
    public ArchivoAdjuntoResponse buscarPorId(Integer id) {
        return mapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public void eliminar(Integer id, HttpServletRequest http) {

        ArchivoAdjuntoEntity archivo = obtenerOFallar(id);
        storageService.eliminarArchivo(archivo.getRutaAlmacenamiento());
        repository.delete(archivo);

        auditoriaHelper.ok(TABLA, id, AccionLog.ARCHIVO_ELIMINADO,
                "Archivo eliminado:  " + archivo.getNombreArchivo(), http);
    }

    @Override
    @Transactional(readOnly = true)
    public String obtenerUrl(Integer id) {
        ArchivoAdjuntoEntity archivo = obtenerOFallar(id);
        return storageService.generarUrlFirmada(archivo.getRutaAlmacenamiento());
    }

    // ── Interno ──────────────────────────────────────────────────────────────
    private ArchivoAdjuntoEntity obtenerOFallar(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Archivo no encontrado con codigo: " + id));
    }
}
