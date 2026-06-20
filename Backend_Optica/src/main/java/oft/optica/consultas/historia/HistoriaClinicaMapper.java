package oft.optica.consultas.historia;

import oft.optica.consultas.ConsultaEntity;
import oft.optica.consultas.ConsultaMapper;
import oft.optica.consultas.archivos.ArchivoAdjuntoMapper;
import oft.optica.consultas.mediciones.MedicionOptometricaMapper;
import oft.optica.pacientes.PacienteEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HistoriaClinicaMapper {

    private final ConsultaMapper consultaMapper;
    private final MedicionOptometricaMapper medicionMapper;
    private final ArchivoAdjuntoMapper archivoAdjuntoMapper;

    public HistoriaClinicaMapper(ConsultaMapper consultaMapper,
                                 MedicionOptometricaMapper medicionMapper,
                                 ArchivoAdjuntoMapper archivoAdjuntoMapper) {
        this.consultaMapper = consultaMapper;
        this.medicionMapper = medicionMapper;
        this.archivoAdjuntoMapper = archivoAdjuntoMapper;
    }

    public HistoriaClinicaResponse toDTO(PacienteEntity paciente, List<ConsultaEntity> consultas) {

        List<HistoriaClinicaResponse.ConsultaHistorialItem> items = consultas.stream()
                .map(consulta -> new HistoriaClinicaResponse.ConsultaHistorialItem(
                        consultaMapper.toDTO(consulta),
                        consulta.getMedicion() != null
                                ? medicionMapper.toDTO(consulta.getMedicion())
                                : null,
                        consulta.getArchivoAdjuntos() != null
                                ? consulta.getArchivoAdjuntos().stream()
                                .map(archivoAdjuntoMapper::toDTO)
                                .toList()
                                : List.of()
                ))
                .toList();

        return new HistoriaClinicaResponse(
                paciente.getId(),
                paciente.getNumeroDocumento(),
                paciente.getNombreCompleto(),
                paciente.getFechaNacimiento(),
                paciente.getGenero(),
                paciente.getTelefono(),
                paciente.getTipoDocumento() != null ? paciente.getTipoDocumento().getCodigo() : null,
                paciente.getEps() != null ? paciente.getEps().getCodigo() : null,
                consultas.size(),
                items
        );
    }
}
