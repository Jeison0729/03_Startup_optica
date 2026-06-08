package oft.optica.consultas.acompanantes;

import oft.optica.catalogos.parentesco.ParentescoEntity;
import oft.optica.consultas.ConsultaEntity;
import org.springframework.stereotype.Component;

@Component
public class AcompananteMapper {

    public AcompananteResponse toDTO(AcompananteEntity acompanante) {
        return new AcompananteResponse(
                acompanante.getId(),
                acompanante.getConsulta().getId(),
                acompanante.getNombre(),
                acompanante.getParentesco() != null ? acompanante.getParentesco().getCodigo() : null,
                acompanante.getTelefono()
        );
    }

    public AcompananteEntity toEntity(
            AcompananteRequest dto,
            ConsultaEntity consulta,
            ParentescoEntity parentesco) {
        return AcompananteEntity.builder()
                .consulta(consulta)
                .nombre(dto.nombre())
                .parentesco(parentesco)
                .telefono(dto.telefono())
                .build();
    }

}
