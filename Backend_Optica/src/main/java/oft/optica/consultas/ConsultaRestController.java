package oft.optica.consultas;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oft.optica.consultas.historia.HistoriaClinicaResponse;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Tag(name = "Consultas", description = "Gestión de consultas optométricas")
@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaRestController {

    private final ConsultaService consultaService;

    // POST /api/consultas
    @Operation(summary = "Crear consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Consulta creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente u optometra no encontrado")
    })
    @PostMapping
    public ResponseEntity<ConsultaResponse> crear(
            @Valid @RequestBody ConsultaRequest request,
            HttpServletRequest http) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(consultaService.crear(request, http));
    }

    // GET /api/consultas?idPaciente=&idEstado=&desde=&hasta=&page=&size=
    @Operation(summary = "Listar consultas con filtros y paginación")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de consultas"),
            @ApiResponse(responseCode = "204", description = "Sin resultados")
    })
    @GetMapping
    public ResponseEntity<Page<ConsultaResponse>> listar(
            @RequestParam(required = false) Integer idPaciente,
            @RequestParam(required = false) Integer idEstado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @PageableDefault(size = 10, sort = "fechaConsulta") Pageable pageable) {

        Page<ConsultaResponse> pagina =
                consultaService.listar(idPaciente, idEstado, desde, hasta, pageable);

        if (pagina.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(pagina);
    }

    // GET /api/consultas/{id}
    @Operation(summary = "Buscar consulta por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta encontrada"),
            @ApiResponse(responseCode = "404", description = "Consulta no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.buscarPorId(id));
    }

    // PUT /api/consultas/{id}
    @Operation(summary = "Actualizar consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta actualizada"),
            @ApiResponse(responseCode = "404", description = "Consulta no encontrada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ConsultaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ConsultaRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(consultaService.actualizar(id, request, http));
    }

    // PATCH /api/consultas/{id}/estado
    @Operation(summary = "Cambiar estado de la consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "404", description = "Consulta no encontrada")
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ConsultaResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarEstadoRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(consultaService.cambiarEstado(id, request, http));
    }

    // GET /api/consultas/historial/{idPaciente}
    @Operation(summary = "Obtener historia clínica completa de un paciente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Historia clínica encontrada"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @GetMapping("/historial/{idPaciente}")
    public ResponseEntity<HistoriaClinicaResponse> obtenerHistoriaClinica(
            @PathVariable Integer idPaciente) {
        return ResponseEntity.ok(consultaService.obtenerHistoriaClinica(idPaciente));
    }
}
