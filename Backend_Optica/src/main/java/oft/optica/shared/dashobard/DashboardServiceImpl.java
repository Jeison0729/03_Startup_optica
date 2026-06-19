package oft.optica.shared.dashobard;

import lombok.RequiredArgsConstructor;
import oft.optica.accesos.solicitudes.SolicitudRepository;
import oft.optica.accesos.usuario.UsuarioRepository;
import oft.optica.auditorias.LogAuditoriaRepository;
import oft.optica.consultas.ConsultaRepository;
import oft.optica.pacientes.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SolicitudRepository solicitudRepository;
    private final LogAuditoriaRepository logAuditoriaRepository;

    @Override
    public DashboardResponse obtenerResumen(boolean esDev) {

        // ── Fechas ──────────────────────────────────────────────
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);
        LocalDateTime inicioMes = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime finMes = YearMonth.now().atEndOfMonth().atTime(23, 59, 59);

        // ── Pacientes ───────────────────────────────────────────
        long pacientesActivos = pacienteRepository.countByEstadoCodigo("ACTIVO");
        long pacientesInactivos = pacienteRepository.countByEstadoCodigo("INACTIVO");
        long pacientesEsteMes = pacienteRepository.countByFechaRegistroBetween(inicioMes, finMes);

        // ── Consultas ───────────────────────────────────────────
        long consultasHoy = consultaRepository.countByFechaConsultaBetween(inicioDia, finDia);
        long borrador = consultaRepository.countByEstadoCodigo("BORRADOR");
        long enProceso = consultaRepository.countByEstadoCodigo("EN_PROCESO");
        long finalizadas = consultaRepository.countByEstadoCodigo("FINALIZADA");
        long anuladas = consultaRepository.countByEstadoCodigo("ANULADA");

        // ── Solo DEV ────────────────────────────────────────────
        Long totalUsuarios = null;
        Long usuariosBloqueados = null;
        Long solicitudesPendientes = null;
        Long logsHoy = null;

        if (esDev) {
            totalUsuarios = usuarioRepository.countByEstadoUsuarioCodigo("ACTIVO")
                    + usuarioRepository.countByEstadoUsuarioCodigo("BLOQUEADO")
                    + usuarioRepository.countByEstadoUsuarioCodigo("INACTIVO");
            usuariosBloqueados = usuarioRepository.countByEstadoUsuarioCodigo("BLOQUEADO");
            solicitudesPendientes = solicitudRepository.countByEstadoSolicitudCodigo("PENDIENTE");
            logsHoy = logAuditoriaRepository.countByFechaEventoBetween(inicioDia, finDia);
        }

        return new DashboardResponse(
                pacientesActivos,
                pacientesInactivos,
                consultasHoy,
                borrador,
                enProceso,
                finalizadas,
                anuladas,
                pacientesEsteMes,
                totalUsuarios,
                usuariosBloqueados,
                solicitudesPendientes,
                logsHoy
        );
    }
}
