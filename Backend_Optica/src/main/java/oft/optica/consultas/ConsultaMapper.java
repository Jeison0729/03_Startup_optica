package oft.optica.consultas;

import oft.optica.accesos.usuario.UsuarioEntity;
import oft.optica.catalogos.estado_consulta.EstadoConsultaEntity;
import oft.optica.pacientes.PacienteEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ConsultaMapper {

    public ConsultaResponse toDTO(ConsultaEntity consulta) {
        return new ConsultaResponse(
                consulta.getId(),
                consulta.getPaciente().getNombreCompleto(),
                consulta.getOptometra().getUsuarioNombre(),
                consulta.getFechaConsulta(),
                consulta.getMotivoConsulta(),
                consulta.getUltimoControl(),
                consulta.getAntecedentes(),
                consulta.getAntecedentesFamiliares(),
                consulta.getExamenExterno(),
                consulta.getTonometriaOd(),
                consulta.getTonometriaOi(),
                consulta.getTestColor(),
                consulta.getFondoOjo(),
                consulta.getDiagnostico(),
                consulta.getConducta(),
                consulta.getControlSugerido(),
                consulta.getRemision(),
                consulta.getEstado().getCodigo(),
                consulta.getFechaCierre(),
                consulta.getMedicion() != null ? consulta.getMedicion().getId() : null,
                0);
    }

    public ConsultaEntity toEntity(ConsultaRequest dto,
                                   PacienteEntity paciente,
                                   UsuarioEntity optometra,
                                   EstadoConsultaEntity estado) {
        return ConsultaEntity.builder()
                .paciente(paciente)
                .optometra(optometra)
                .fechaConsulta(LocalDateTime.now())
                .motivoConsulta(dto.motivoConsulta())
                .ultimoControl(dto.ultimoControl())
                .antecedentes(dto.antecedentes())
                .antecedentesFamiliares(dto.antecedentesFamiliares())
                .examenExterno(dto.examenExterno())
                .tonometriaOd(dto.tonometriaOd())
                .tonometriaOi(dto.tonometriaOi())
                .testColor(dto.testColor())
                .fondoOjo(dto.fondoOjo())
                .diagnostico(dto.diagnostico())
                .conducta(dto.conducta())
                .controlSugerido(dto.controlSugerido())
                .remision(dto.remision())
                .estado(estado)
                .fechaCierre(dto.fechaCierre())
                .build();
    }

    public void updateEntity(ConsultaEntity update,
                             ConsultaRequest dto,
                             PacienteEntity paciente,
                             UsuarioEntity optometra,
                             EstadoConsultaEntity estado) {
        update.setPaciente(paciente);
        update.setOptometra(optometra);
        update.setMotivoConsulta(dto.motivoConsulta());
        update.setUltimoControl(dto.ultimoControl());
        update.setAntecedentes(dto.antecedentes());
        update.setAntecedentesFamiliares(dto.antecedentesFamiliares());
        update.setExamenExterno(dto.examenExterno());
        update.setTonometriaOd(dto.tonometriaOd());
        update.setTonometriaOi(dto.tonometriaOi());
        update.setTestColor(dto.testColor());
        update.setFondoOjo(dto.fondoOjo());
        update.setDiagnostico(dto.diagnostico());
        update.setConducta(dto.conducta());
        update.setControlSugerido(dto.controlSugerido());
        update.setRemision(dto.remision());
        update.setEstado(estado);
        update.setFechaCierre(dto.fechaCierre());

    }
}
