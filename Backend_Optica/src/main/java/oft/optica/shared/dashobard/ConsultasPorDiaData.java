package oft.optica.shared.dashobard;

import java.util.List;

public record ConsultasPorDiaData(

        List<String> labels,
        List<Long> data,
        List<String> backgroundColors
) {
}
