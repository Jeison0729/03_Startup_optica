package oft.optica.auditorias;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Tag(name = "Auditoria", description = "Log del Sistema - Solo DEV")
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogAuditoriaRestController {

    private final LogAuditoriaService service;

    @Operation(summary = "Listar logs con filtros")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de logs"),
            @ApiResponse(responseCode = "204", description = "Sin logs"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @GetMapping
    public ResponseEntity<Page<LogAuditoriaResponse>> listar(
            @RequestParam(required = false) String tablaAfectada,
            @RequestParam(required = false) Integer registro,
            @RequestParam(required = false) Integer idUsuario,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) Byte resultado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        int sizeLimitado = Math.min(size, 100);
        Pageable pageable = PageRequest.of(page, sizeLimitado, Sort.by("fechaEvento").descending());

        Page<LogAuditoriaResponse> respuesta = service.listarConFiltros(
                tablaAfectada, registro, idUsuario,
                accion, resultado, desde, hasta, pageable);

        return respuesta.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(respuesta);
    }
}