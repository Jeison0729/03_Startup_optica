package oft.optica.consultas.mediciones;

import java.math.BigDecimal;

public record MedicionOptometricaResponse(

        Integer id,
        Integer idConsulta,

        BigDecimal rxUsoOdEsfera,
        BigDecimal rxUsoOdCilindro,
        Integer rxUsoOdEje,
        String rxUsoOdAvVl,

        BigDecimal rxUsoOiEsfera,
        BigDecimal rxUsoOiCilindro,
        Integer rxUsoOiEje,
        String rxUsoOiAvVl,

        String vpOd,
        String vpOi,
        String lenteUso,

        String kmOd,
        String kmOdObservaciones,
        String kmOi,
        String kmOiObservaciones,

        String rxOd,
        String rxOdObservaciones,
        String rxOi,
        String rxOiObservaciones,

        String modalidadPpc,
        String modalidadLejos,
        String modalidadCerca,
        String testTitmus,

        BigDecimal odEsfera,
        BigDecimal odCilindro,
        Integer odEje,
        String odAvVl,

        BigDecimal oiEsfera,
        BigDecimal oiCilindro,
        Integer oiEje,
        String oiAvVl,

        BigDecimal adicion,
        String distanciaPupilar,
        String material,
        String tipoLente,
        String observacionesRx
) {
}
