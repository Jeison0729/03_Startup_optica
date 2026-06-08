package oft.optica.consultas.mediciones;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Mediciones optométricas", description = "Gestión de mediciones por consulta")
@RestController
@RequestMapping("/api/mediciones")
@RequiredArgsConstructor
public class MedicionOptometricaRestController {

    private final MedicionOptometricaService service;

    @Operation(summary = "Registrar medición", description = "Una medición por consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Medición creada"),
            @ApiResponse(responseCode = "409", description = "Ya existe medición para esta consulta"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PostMapping
    public ResponseEntity<MedicionOptometricaResponse> crear(
            @Valid @RequestBody MedicionOptometricaRequest request,
            HttpServletRequest http) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(request, http));
    }

    @Operation(summary = "Buscar medición por consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Medición encontrada"),
            @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @GetMapping("/consulta/{idConsulta}")
    public ResponseEntity<MedicionOptometricaResponse> buscarPorConsulta(
            @PathVariable Integer idConsulta) {
        return ResponseEntity.ok(service.buscarPorConsulta(idConsulta));
    }

    @Operation(summary = "Buscar medición por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Medición encontrada"),
            @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MedicionOptometricaResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Actualizar medición")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Medición actualizada"),
            @ApiResponse(responseCode = "404", description = "No encontrada"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MedicionOptometricaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody MedicionOptometricaRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(service.actualizar(id, request, http));
    }
}
