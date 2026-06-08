package oft.optica.consultas.acompanantes;

import lombok.RequiredArgsConstructor;
import oft.optica.catalogos.parentesco.ParentescoEntity;
import oft.optica.catalogos.parentesco.ParentescoRepository;
import oft.optica.consultas.ConsultaEntity;
import oft.optica.consultas.ConsultaRepository;
import oft.optica.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AcompananteHelper {

    private final ConsultaRepository consultaRepository;
    private final ParentescoRepository parentescoRepository;

    public ConsultaEntity resolverConsulta(Integer id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Consulta no encontrada con id: " + id));
    }

    public ParentescoEntity resolverParentesco(Integer id) {
        if (id == null) return null;
        return parentescoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Parentesco no encontrado con id: " + id));
    }
}
