package oft.optica.shared.dashobard;

import java.util.List;

public record DashboardResponse(
        // ── KPIs DEL DÍA (ambos roles) ────────────────────────
        long consultasEnProceso,
        long consultasBorrador,
        long solicitudesPendientes,

        // ── KPIs DEL DÍA (solo DEV) ───────────────────────────
        Long usuariosBloqueados,

        // ── GRÁFICA (dona) ─────────────────────────────────────
        ConsultasPorDiaData consultasPorDia,

        // ── ACTIVIDADES RECIENTES ──────────────────────────────
        List<ActividadReciente> ultimasActividades
) {
}
