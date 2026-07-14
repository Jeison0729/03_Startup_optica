package oft.optica.shared.dashobard;

import java.time.LocalDateTime;

public record ActividadReciente(
        Integer id,
        String descripcion,
        LocalDateTime fecha,
        String icono,
        String color) {
}
