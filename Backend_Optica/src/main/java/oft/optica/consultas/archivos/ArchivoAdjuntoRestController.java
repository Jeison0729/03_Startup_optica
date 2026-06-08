package oft.optica.consultas.archivos;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "archivos adjuntos", description = "Gestión de archivos por consulta")
@RestController
@RequestMapping("/api/adjuntos")
@RequiredArgsConstructor
public class ArchivoAdjuntoRestController {

    private final ArchivoAdjuntoService service;

    @Operation(summary = "Cargar archivos", description = "Crea un archivo adjunto  asociado a una consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Adjunto creado"),
            @ApiResponse(responseCode = "404", description = "Adjunto  no encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PostMapping
    public ResponseEntity<ArchivoAdjuntoResponse> crear(
            @Valid @RequestBody ArchivoAdjuntoRequest request,
            HttpServletRequest http) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(request, http));
    }

    @Operation(summary = "Listar adjuntos por consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de adjuntos"),
            @ApiResponse(responseCode = "204", description = "Sin adjuntos"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @GetMapping
    public ResponseEntity<Page<ArchivoAdjuntoResponse>> listar(
            @RequestParam Integer idConsulta,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<ArchivoAdjuntoResponse> pagina = service.listar(idConsulta, pageable);
        if (pagina.isEmpty()) return ResponseEntity.noContent().build();

        return ResponseEntity.ok(pagina);
    }

    @Operation(summary = "Buscar adjuntos por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Adjunto encontrado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ArchivoAdjuntoResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Actualizar adjunto")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Adjunto actualizado"),
            @ApiResponse(responseCode = "404", description = "No encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ArchivoAdjuntoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ArchivoAdjuntoRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(service.actualizar(id, request, http));
    }

    @Operation(summary = "Eliminar adjuntos")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Adjunto eliminado"),
            @ApiResponse(responseCode = "404", description = "No encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(
            @PathVariable Integer id,
            HttpServletRequest http) {
        service.eliminar(id, http);
        return ResponseEntity.ok(Map.of("mensaje", "Adjunto eliminado"));
    }
}
