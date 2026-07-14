package oft.optica.shared.dashobard;

import lombok.RequiredArgsConstructor;
import oft.optica.accesos.solicitudes.SolicitudRepository;
import oft.optica.accesos.usuario.UsuarioRepository;
import oft.optica.auditorias.LogAuditoriaRepository;
import oft.optica.consultas.ConsultaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SolicitudRepository solicitudRepository;
    private final LogAuditoriaRepository logAuditoriaRepository;

    @Override
    public DashboardResponse obtenerResumen(boolean esDev, String periodo) {

        long consultasEnProceso = consultaRepository.countByEstadoCodigo("EN_PROCESO");
        long consultasBorrador = consultaRepository.countByEstadoCodigo("BORRADOR");
        long solicitudesPendientes = solicitudRepository.countByEstadoSolicitudCodigo("PENDIENTE");

        Long usuariosBloqueados = null;
        if (esDev) {
            usuariosBloqueados = usuarioRepository.countByEstadoUsuarioCodigo("BLOQUEADO");
        }

        LocalDateTime[] rango = resolverRango(periodo);
        ConsultasPorDiaData graficaData = construirGrafica(rango[0], rango[1]);
        List<ActividadReciente> actividades = construirActividades(esDev);

        return new DashboardResponse(
                consultasEnProceso,
                consultasBorrador,
                solicitudesPendientes,
                usuariosBloqueados,
                graficaData,
                actividades
        );
    }

    private ConsultasPorDiaData construirGrafica(LocalDateTime desde, LocalDateTime hasta) {

        long finalizadas = consultaRepository.countByEstadoCodigoAndFechaConsultaBetween("FINALIZADA", desde, hasta);
        long enProceso = consultaRepository.countByEstadoCodigoAndFechaConsultaBetween("EN_PROCESO", desde, hasta);
        long borrador = consultaRepository.countByEstadoCodigoAndFechaConsultaBetween("BORRADOR", desde, hasta);
        long anuladas = consultaRepository.countByEstadoCodigoAndFechaConsultaBetween("ANULADA", desde, hasta);

        return new ConsultasPorDiaData(
                List.of("Finalizadas", "En proceso", "Borrador", "Anuladas"),
                List.of(finalizadas, enProceso, borrador, anuladas),
                List.of("#198754", "#ffc107", "#0d6efd", "#dc3545")
        );
    }

    private List<ActividadReciente> construirActividades(boolean esDev) {

        List<String> accionesFiltradas = esDev
                ? List.of("PACIENTE_CREADO", "CONSULTA_CREADA", "CONSULTA_FINALIZADA",
                "CONSULTA_ANULADA", "ARCHIVO_SUBIDO",
                "USUARIO_CREADO", "USUARIO_BLOQUEADO", "SOLICITUD_APROBADA")
                : List.of("PACIENTE_CREADO", "CONSULTA_CREADA", "CONSULTA_FINALIZADA",
                "CONSULTA_ANULADA", "ARCHIVO_SUBIDO");

        return logAuditoriaRepository.findTop8ByOrderByFechaEventoDesc()
                .stream()
                .filter(log -> accionesFiltradas.contains(log.getAccion()))
                .map(log -> new ActividadReciente(
                        log.getId(),
                        resolverDescripcion(log.getAccion(), log.getDetalle()),
                        log.getFechaEvento(),
                        resolverIcono(log.getAccion()),
                        resolverColor(log.getAccion())
                ))
                .toList();
    }

    private LocalDateTime[] resolverRango(String periodo) {
        LocalDateTime ahora = LocalDateTime.now();
        return switch (periodo) {
            case "hoy" -> new LocalDateTime[]{LocalDate.now().atStartOfDay(), ahora};
            case "mes" -> new LocalDateTime[]{YearMonth.now().atDay(1).atStartOfDay(), ahora};
            case "trimestre" -> new LocalDateTime[]{ahora.minusMonths(3), ahora};
            default -> new LocalDateTime[]{ahora.minusDays(6).toLocalDate().atStartOfDay(), ahora};
        };
    }

    private String resolverDescripcion(String accion, String detalle) {
        if (accion == null) return detalle;
        return switch (accion) {
            case "CONSULTA_CREADA" -> "Nueva consulta registrada";
            case "CONSULTA_FINALIZADA" -> "Consulta completada";
            case "CONSULTA_ANULADA" -> "Consulta anulada";
            case "PACIENTE_CREADO" -> "Nuevo paciente registrado";
            case "ARCHIVO_SUBIDO" -> "Archivo adjunto a consulta";
            case "USUARIO_CREADO" -> "Nuevo usuario creado";
            case "USUARIO_BLOQUEADO" -> "Usuario bloqueado en el sistema";
            case "SOLICITUD_APROBADA" -> "Solicitud de recuperación aprobada";
            default -> detalle;
        };
    }

    private String resolverIcono(String accion) {
        if (accion == null) return "bi-circle-fill";
        return switch (accion) {
            case "CONSULTA_CREADA" -> "bi-calendar-plus";
            case "CONSULTA_FINALIZADA" -> "bi-check-circle-fill";
            case "CONSULTA_ANULADA" -> "bi-x-circle-fill";
            case "PACIENTE_CREADO" -> "bi-person-plus-fill";
            case "ARCHIVO_SUBIDO" -> "bi-paperclip";
            case "USUARIO_CREADO" -> "bi-person-badge-fill";
            case "USUARIO_BLOQUEADO" -> "bi-person-x-fill";
            case "SOLICITUD_APROBADA" -> "bi-envelope-check-fill";
            default -> "bi-circle-fill";
        };
    }

    private String resolverColor(String accion) {
        if (accion == null) return "secondary";
        return switch (accion) {
            case "CONSULTA_FINALIZADA", "PACIENTE_CREADO", "SOLICITUD_APROBADA" -> "success";
            case "CONSULTA_ANULADA", "USUARIO_BLOQUEADO" -> "danger";
            case "CONSULTA_CREADA", "USUARIO_CREADO" -> "primary";
            case "ARCHIVO_SUBIDO" -> "info";
            default -> "secondary";
        };
    }
}
