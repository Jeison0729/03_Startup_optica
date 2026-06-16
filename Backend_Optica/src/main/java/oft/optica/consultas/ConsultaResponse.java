package oft.optica.consultas;

import java.time.LocalDateTime;

public record ConsultaResponse(

        Integer id,

        Integer idPaciente,

        String paciente,

        String optometra,

        LocalDateTime fechaConsulta,

        String motivoConsulta,

        String ultimoControl,

        String antecedentes,

        String antecedentesFamiliares,

        String examenExterno,

        String tonometriaOd,

        String tonometriaOi,

        String testColor,

        String fondoOjo,

        String diagnostico,

        String conducta,

        String controlSugerido,

        String remision,

        String estado,

        LocalDateTime fechaCierre,

        Integer idMedicion,

        Integer totalArchivos
) {
}
