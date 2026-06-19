package oft.optica.shared.dashobard;

public record DashboardResponse(

        // ── COMPARTIDOS (ADMIN + DEV) ──────────────────────────
        long totalPacientesActivos,
        long totalPacientesInactivos,
        long consultasHoy,
        long consultasBorrador,
        long consultasEnProceso,
        long consultasFinalizadas,
        long consultasAnuladas,
        long pacientesEsteMes,

        // ── SOLO DEV (null para ADMIN) ─────────────────────────
        Long totalUsuarios,
        Long usuariosBloqueados,
        Long solicitudesPendientes,
        Long logsHoy
) {
}
