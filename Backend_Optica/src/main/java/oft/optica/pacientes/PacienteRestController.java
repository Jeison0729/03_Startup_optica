package oft.optica.pacientes;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oft.optica.shared.common.CambiarEstadoRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Pacientes", description = "Gestión de pacientes")
@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteRestController {

    private final PacienteService pacienteService;

    @Operation(summary = "Registrar paciente")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Paciente registrado"),
            @ApiResponse(responseCode = "409", description = "Documento ya registrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<PacienteResponse> crear(
            @Valid @RequestBody PacienteRequest request,
            HttpServletRequest http) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(pacienteService.crear(request, http));
    }

    @Operation(summary = "Listar pacientes con filtros y paginación")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de pacientes"),
            @ApiResponse(responseCode = "204", description = "Sin resultados")
    })
    @GetMapping
    public ResponseEntity<Page<PacienteResponse>> listar(
            @RequestParam(required = false) String nombreCompleto,
            @RequestParam(required = false) String numeroDocumento,
            @RequestParam(required = false) Integer idEstado,
            @PageableDefault(size = 10, sort = "nombreCompleto") Pageable pageable) {

        Page<PacienteResponse> pagina =
                pacienteService.listar(nombreCompleto, numeroDocumento, idEstado, pageable);

        if (pagina.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(pagina);
    }

    @Operation(summary = "Buscar paciente por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    @Operation(summary = "Actualizar datos del paciente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paciente actualizado"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado"),
            @ApiResponse(responseCode = "409", description = "Documento ya registrado en otro paciente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(pacienteService.actualizar(id, request, http));
    }

    @Operation(summary = "Cambiar estado del paciente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<PacienteResponse> cambiarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarEstadoRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(pacienteService.cambiarEstado(id, request, http));
    }
}