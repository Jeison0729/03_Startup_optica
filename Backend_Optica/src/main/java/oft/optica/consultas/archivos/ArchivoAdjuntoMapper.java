package oft.optica.consultas.archivos;

import oft.optica.consultas.ConsultaEntity;
import org.springframework.stereotype.Component;

@Component
public class ArchivoAdjuntoMapper {

    public ArchivoAdjuntoResponse toDTO(ArchivoAdjuntoEntity archivo) {
        return new ArchivoAdjuntoResponse(
                archivo.getId(),
                archivo.getConsulta().getId(),
                archivo.getNombreArchivo(),
                archivo.getRutaAlmacenamiento(),
                archivo.getTipoContenido(),
                archivo.getFechaSubida()
        );
    }

    public ArchivoAdjuntoEntity toEntity(
            ArchivoAdjuntoRequest dto,
            ConsultaEntity consulta) {
        return ArchivoAdjuntoEntity.builder()
                .consulta(consulta)
                .build();
    }

}
