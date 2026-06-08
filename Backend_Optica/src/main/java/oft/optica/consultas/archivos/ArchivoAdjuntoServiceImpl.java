package oft.optica.consultas.archivos;

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
public class ArchivoAdjuntoServiceImpl implements ArchivoAdjuntoService {

    private static final String TABLA = "archivos_adjuntos";

    private final ArchivoAdjuntoRepository repository;
    private final ArchivoAdjuntoMapper mapper;
    private final ArchivoAdjuntoHelper helper;
    private final AuditoriaHelper auditoriaHelper;


    @Override
    @Transactional
    public ArchivoAdjuntoResponse crear(ArchivoAdjuntoRequest request, HttpServletRequest http) {

        ArchivoAdjuntoEntity nuevo = mapper.toEntity(request, helper.resolverConsulta(request.idConsulta()));

        ArchivoAdjuntoEntity guardado = repository.save(nuevo);

        auditoriaHelper.ok(TABLA, guardado.getId(), AccionLog.ARCHIVO_SUBIDO, "Archivo cargado correctamente. " + guardado.getNombreArchivo(), http);

        return mapper.toDTO(guardado);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ArchivoAdjuntoResponse> listar(Integer idConsulta, Pageable pageable) {
        List<ArchivoAdjuntoResponse> lista = repository.findByConsultaId(idConsulta).stream().map(mapper::toDTO).toList();

        return new PageImpl<>(lista, pageable, lista.size());
    }

    @Override
    @Transactional(readOnly = true)
    public ArchivoAdjuntoResponse buscarPorId(Integer id) {
        return mapper.toDTO(obtenerOFallar(id));
    }

    @Override
    @Transactional
    public ArchivoAdjuntoResponse actualizar(Integer id, ArchivoAdjuntoRequest request, HttpServletRequest http) {

        ArchivoAdjuntoEntity existe = obtenerOFallar(id);

        existe.setNombreArchivo(request.nombreArchivo());
        existe.setRutaAlmacenamiento(request.rutaAlmacenamiento());
        existe.setTipoContenido(request.tipoContenido());

        ArchivoAdjuntoEntity actualizado = repository.save(existe);

        auditoriaHelper.ok(TABLA, actualizado.getId(),
                AccionLog.ARCHIVO_ACTUALIZADO,
                "Archivo actualizado: " + actualizado.getNombreArchivo(), http);


        return mapper.toDTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Integer id, HttpServletRequest http) {
        ArchivoAdjuntoEntity archivo = obtenerOFallar(id);
        repository.delete(archivo);

        auditoriaHelper.ok(TABLA, id, AccionLog.ARCHIVO_ELIMINADO,
                "Archivo eliminado correctamente:  " + archivo.getNombreArchivo(), http);
    }


    // ── Interno ──────────────────────────────────────────────────────────────
    private ArchivoAdjuntoEntity obtenerOFallar(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Archivo no encontrado con codigo: " + id));
    }
}
