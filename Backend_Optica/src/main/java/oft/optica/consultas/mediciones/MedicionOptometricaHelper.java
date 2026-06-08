package oft.optica.consultas.mediciones;

import lombok.RequiredArgsConstructor;
import oft.optica.catalogos.material.MaterialEntity;
import oft.optica.catalogos.material.MaterialRepository;
import oft.optica.catalogos.tipo_lente.TipoLenteEntity;
import oft.optica.catalogos.tipo_lente.TipoLenteRepository;
import oft.optica.consultas.ConsultaEntity;
import oft.optica.consultas.ConsultaRepository;
import oft.optica.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicionOptometricaHelper {

    private final ConsultaRepository consultaRepository;
    private final MaterialRepository materialRepository;
    private final TipoLenteRepository tipoLenteRepository;

    public ConsultaEntity resolverConsulta(Integer id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Consulta no encontrada con id: " + id));
    }

    public MaterialEntity resolverMaterial(Integer id) {
        if (id == null) return null;
        return materialRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Material no encontrado con id: " + id));
    }

    public TipoLenteEntity resolverTipoLente(Integer id) {
        if (id == null) return null;
        return tipoLenteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Tipo de lente no encontrado con id: " + id));
    }
}
