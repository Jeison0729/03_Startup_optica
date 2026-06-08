package oft.optica.consultas;

import lombok.RequiredArgsConstructor;
import oft.optica.accesos.usuario.UsuarioEntity;
import oft.optica.accesos.usuario.UsuarioRepository;
import oft.optica.catalogos.estado_consulta.EstadoConsultaEntity;
import oft.optica.catalogos.estado_consulta.EstadoConsultaRepository;
import oft.optica.exception.RecursoNoEncontradoException;
import oft.optica.pacientes.PacienteEntity;
import oft.optica.pacientes.PacienteRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConsultaHelper {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoConsultaRepository estadoConsultaRepository;

    public PacienteEntity resolverPaciente(Integer id) {
        return pacienteRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Paciente no encontrado con id: " + id));
    }

    public UsuarioEntity resolverOptometra(Integer id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Optometra no encontrado con id: " + id));
    }

    public EstadoConsultaEntity resolverEstado(Integer id) {
        return estadoConsultaRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Estado de consulta no encontrado con id: " + id));
    }
}
