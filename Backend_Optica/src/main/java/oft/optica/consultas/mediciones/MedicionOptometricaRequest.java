package oft.optica.consultas.mediciones;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MedicionOptometricaRequest(

        @NotNull(message = "La consulta es obligatoria.")
        Integer idConsulta,

        // Rx en uso
        BigDecimal rxUsoOdEsfera,
        BigDecimal rxUsoOdCilindro,
        @Min(0) @Max(180) Integer rxUsoOdEje,
        String rxUsoOdAvVl,

        BigDecimal rxUsoOiEsfera,
        BigDecimal rxUsoOiCilindro,
        @Min(0) @Max(180) Integer rxUsoOiEje,
        String rxUsoOiAvVl,

        // Visión próxima
        String vpOd,
        String vpOi,
        String lenteUso,

        // Queratometría
        String kmOd,
        String kmOdObservaciones,
        String kmOi,
        String kmOiObservaciones,

        // Refracción intermedia
        String rxOd,
        String rxOdObservaciones,
        String rxOi,
        String rxOiObservaciones,

        // Modalidad
        String modalidadPpc,
        String modalidadLejos,
        String modalidadCerca,
        String testTitmus,

        // Rx Final OD
        BigDecimal odEsfera,
        BigDecimal odCilindro,
        @Min(0) @Max(180) Integer odEje,
        String odAvVl,

        // Rx Final OI
        BigDecimal oiEsfera,
        BigDecimal oiCilindro,
        @Min(0) @Max(180) Integer oiEje,
        String oiAvVl,

        // Complementarios
        BigDecimal adicion,
        String distanciaPupilar,
        Integer idMaterial,
        Integer idTipoLente,
        String observacionesRx
) {
}
