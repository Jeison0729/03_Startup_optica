package oft.optica.consultas.archivos;

import lombok.RequiredArgsConstructor;
import oft.optica.consultas.ConsultaEntity;
import oft.optica.consultas.ConsultaRepository;
import oft.optica.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ArchivoAdjuntoHelper {

    private final ConsultaRepository consultaRepository;

    public ConsultaEntity resolverConsulta(Integer id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Consulta no encontrada con id: " + id));
    }

}
