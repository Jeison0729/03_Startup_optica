package oft.optica.consultas.acompanantes;

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

@Tag(name = "Acompañantes", description = "Gestión de acompañantes por consulta")
@RestController
@RequestMapping("/api/acompanantes")
@RequiredArgsConstructor
public class AcompananteRestController {

    private final AcompananteService acompananteService;

    @Operation(summary = "Registrar acompañante", description = "Crea un acompañante asociado a una consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Acompañante creado"),
            @ApiResponse(responseCode = "404", description = "Consulta o parentesco no encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PostMapping
    public ResponseEntity<AcompananteResponse> crear(
            @Valid @RequestBody AcompananteRequest request,
            HttpServletRequest http) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(acompananteService.crear(request, http));
    }


    @Operation(summary = "Listar acompañantes por consulta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de acompañantes"),
            @ApiResponse(responseCode = "204", description = "Sin acompañantes"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @GetMapping
    public ResponseEntity<Page<AcompananteResponse>> listar(
            @RequestParam Integer idConsulta,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<AcompananteResponse> pagina = acompananteService.listar(idConsulta, pageable);

        if (pagina.isEmpty()) return ResponseEntity.noContent().build();

        return ResponseEntity.ok(pagina);
    }

    @Operation(summary = "Buscar acompañante por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Acompañante encontrado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AcompananteResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(acompananteService.buscarPorId(id));
    }

    @Operation(summary = "Actualizar acompañante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Acompañante actualizado"),
            @ApiResponse(responseCode = "404", description = "No encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AcompananteResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody AcompananteRequest request,
            HttpServletRequest http) {

        return ResponseEntity.ok(acompananteService.actualizar(id, request, http));
    }

    @Operation(summary = "Eliminar acompañante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Acompañante eliminado"),
            @ApiResponse(responseCode = "404", description = "No encontrado"),
            @ApiResponse(responseCode = "403", description = "Sin permisos")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(
            @PathVariable Integer id,
            HttpServletRequest http) {

        acompananteService.eliminar(id, http);
        return ResponseEntity.ok(Map.of("mensaje", "Acompañante eliminado correctamente."));
    }


}
