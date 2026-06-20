package oft.optica.consultas.historia;

import oft.optica.consultas.ConsultaResponse;
import oft.optica.consultas.archivos.ArchivoAdjuntoResponse;
import oft.optica.consultas.mediciones.MedicionOptometricaResponse;

import java.time.LocalDate;
import java.util.List;

public record HistoriaClinicaResponse(

        Integer idPaciente,
        String numeroDocumento,
        String nombreCompleto,
        LocalDate fechaNacimiento,
        String genero,
        String telefono,
        String tipoDocumento,
        String eps,

        Integer totalConsultas,
        List<ConsultaHistorialItem> consultas
) {
    public record ConsultaHistorialItem(
            ConsultaResponse consulta,
            MedicionOptometricaResponse medicion,
            List<ArchivoAdjuntoResponse> archivos
    ) {
    }
}
