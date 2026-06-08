package oft.optica.pacientes;

import oft.optica.catalogos.eps.EpsEntity;
import oft.optica.catalogos.estado_paciente.EstadoPacienteEntity;
import oft.optica.catalogos.tipo_documento.TipoDocumentoEntity;
import org.springframework.stereotype.Component;

@Component
public class PacienteMapper {


    public PacienteResponse toDTO(PacienteEntity paciente) {
        return new PacienteResponse(
                paciente.getId(),
                paciente.getTipoDocumento().getCodigo(),
                paciente.getNumeroDocumento(),
                paciente.getNombreCompleto(),
                paciente.getFechaNacimiento(),
                paciente.getGenero(),
                paciente.getEstadoCivil(),
                paciente.getOcupacion(),
                paciente.getDireccion(),
                paciente.getTelefono(),
                paciente.getEps() != null ? paciente.getEps().getCodigo() : null,
                paciente.getVinculacion(),
                paciente.getEstado().getCodigo(),
                paciente.getFechaRegistro());

    }

    public PacienteEntity toEntity(
            PacienteRequest dto,
            TipoDocumentoEntity tipoDoc,
            EpsEntity eps,
            EstadoPacienteEntity estado) {
        return PacienteEntity.builder()
                .tipoDocumento(tipoDoc)
                .numeroDocumento(dto.numeroDocumento())
                .nombreCompleto(dto.nombreCompleto())
                .fechaNacimiento(dto.fechaNacimiento())
                .genero(dto.genero())
                .estadoCivil(dto.estadoCivil())
                .ocupacion(dto.ocupacion())
                .direccion(dto.direccion())
                .telefono(dto.telefono())
                .eps(eps)
                .vinculacion(dto.tipoVinculacion())
                .estado(estado)
                .build();
    }

    public void updateEntity(
            PacienteEntity update,
            PacienteRequest dto,
            TipoDocumentoEntity tipoDoc,
            EpsEntity eps,
            EstadoPacienteEntity estado) {
        update.setTipoDocumento(tipoDoc);
        update.setNumeroDocumento(dto.numeroDocumento());
        update.setNombreCompleto(dto.nombreCompleto());
        update.setFechaNacimiento(dto.fechaNacimiento());
        update.setGenero(dto.genero());
        update.setEstadoCivil(dto.estadoCivil());
        update.setOcupacion(dto.ocupacion());
        update.setDireccion(dto.direccion());
        update.setTelefono(dto.telefono());
        update.setEps(eps);
        update.setVinculacion(dto.tipoVinculacion());
        update.setEstado(estado);
    }
}
