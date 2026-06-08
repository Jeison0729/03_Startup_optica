package oft.optica.pacientes;

import lombok.RequiredArgsConstructor;
import oft.optica.catalogos.eps.EpsEntity;
import oft.optica.catalogos.eps.EpsRepository;
import oft.optica.catalogos.estado_paciente.EstadoPacienteEntity;
import oft.optica.catalogos.estado_paciente.EstadoPacienteRepository;
import oft.optica.catalogos.tipo_documento.TipoDocumentoEntity;
import oft.optica.catalogos.tipo_documento.TipoDocumentoRepository;
import oft.optica.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PacienteHelper {

    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final EpsRepository epsRepository;
    private final EstadoPacienteRepository estadoPacienteRepository;

    public TipoDocumentoEntity resolverTipoDocumento(Integer id) {
        return tipoDocumentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Tipo de documento no encontrado con id: " + id));
    }

    public EpsEntity resolverEps(Integer id) {
        if (id == null) return null;
        return epsRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "EPS no encontrada con id: " + id));
    }

    public EstadoPacienteEntity resolverEstado(Integer id) {
        return estadoPacienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Estado de paciente no encontrado con id: " + id));
    }
}