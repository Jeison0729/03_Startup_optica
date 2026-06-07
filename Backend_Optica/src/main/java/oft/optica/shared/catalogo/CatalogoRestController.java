package oft.optica.shared.catalogo;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import oft.optica.catalogos.eps.EpsRepository;
import oft.optica.catalogos.estado_consulta.EstadoConsultaRepository;
import oft.optica.catalogos.estado_paciente.EstadoPacienteRepository;
import oft.optica.catalogos.material.MaterialRepository;
import oft.optica.catalogos.parentesco.ParentescoRepository;
import oft.optica.catalogos.tipo_documento.TipoDocumentoRepository;
import oft.optica.catalogos.tipo_lente.TipoLenteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
public class CatalogoRestController {

    private final EpsRepository epsRepository;
    private final EstadoConsultaRepository estadoConsultaRepository;
    private final EstadoPacienteRepository estadoPacienteRepository;
    private final MaterialRepository materialRepository;
    private final ParentescoRepository parentescoRepository;
    private final TipoDocumentoRepository tipodocumentoRepository;
    private final TipoLenteRepository tipoLenteRepository;


    // EPS
    @Operation(summary = "Listar EPS")
    @GetMapping("/eps")
    public List<CatalogoResponse> eps() {
        return epsRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // ESTADO  CONSULTA
    @Operation(summary = "Listar Estados Consulta")
    @GetMapping("/estados-consulta")
    public List<CatalogoResponse> estadosConsulta() {
        return estadoConsultaRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // ESTADO  PACIENTE
    @Operation(summary = "Lostar Estados Paciente")
    @GetMapping("/estados-paciente")
    public List<CatalogoResponse> estadosPaciente() {
        return estadoPacienteRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // MATERIAL LENTES
    @Operation(summary = "Listar Materiales")
    @GetMapping("/materiales")
    public List<CatalogoResponse> materiales() {
        return materialRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // PARENTESCO
    @Operation(summary = "Listar Parentesco")
    @GetMapping("/parentescos")
    public List<CatalogoResponse> parentescos() {
        return parentescoRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // TIPO DOCUMENTO
    @Operation(summary = "Listar Tipos Documentos")
    @GetMapping("/tipos-documentos")
    public List<CatalogoResponse> tiposDocumentos() {
        return tipodocumentoRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }

    // TIPOS LENTES
    @Operation(summary = "Listar Tipos Lentes")
    @GetMapping("/tipos-lentes")
    public List<CatalogoResponse> tiposLentes() {
        return tipoLenteRepository.findAll()
                .stream()
                .map(catalogo -> new CatalogoResponse(
                        catalogo.getId(),
                        catalogo.getCodigo(),
                        catalogo.getNombre(),
                        catalogo.getDescripcion()
                )).toList();
    }
}
