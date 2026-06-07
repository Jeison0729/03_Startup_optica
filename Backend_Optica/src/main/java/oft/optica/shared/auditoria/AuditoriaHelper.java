package oft.optica.shared.auditoria;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import oft.optica.accesos.usuario.UsuarioEntity;
import oft.optica.auditorias.AccionLog;
import oft.optica.auditorias.LogAuditoriaService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditoriaHelper {

    private final LogAuditoriaService logAuditoriaService;

    // ── Resuelve el usuario del contexto de seguridad ────────────────────────
    private UsuarioEntity usuarioActual() {
        return (UsuarioEntity) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
    }

    // ── Registro con request (extrae IP automáticamente) ────────────────────
    public void registrar(UsuarioEntity usuario,
                          String tablaAfectada,
                          Integer idRegistro,
                          AccionLog accion,
                          String detalle,
                          HttpServletRequest request,
                          boolean exito) {
        logAuditoriaService.registrar(
                usuario, tablaAfectada, idRegistro,
                accion, detalle, extraerIp(request), exito);
    }

    // ── Registro sin request (schedulers, procesos internos) ────────────────
    public void registrar(UsuarioEntity usuario,
                          String tablaAfectada,
                          Integer idRegistro,
                          AccionLog accion,
                          String detalle,
                          boolean exito) {
        logAuditoriaService.registrar(
                usuario, tablaAfectada, idRegistro,
                accion, detalle, "Sistema", exito);
    }

    // ── Shortcuts para flujos AUTENTICADOS (resuelven usuario internamente) ──

    public void ok(String tablaAfectada,
                   Integer idRegistro,
                   AccionLog accion,
                   String detalle,
                   HttpServletRequest request) {
        registrar(usuarioActual(), tablaAfectada, idRegistro, accion, detalle, request, true);
    }

    public void fallo(String tablaAfectada,
                      Integer idRegistro,
                      AccionLog accion,
                      String detalle,
                      HttpServletRequest request) {
        registrar(usuarioActual(), tablaAfectada, idRegistro, accion, detalle, request, false);
    }

    // ──

    public void ok(UsuarioEntity usuario,
                   String tablaAfectada,
                   Integer idRegistro,
                   AccionLog accion,
                   String detalle,
                   HttpServletRequest request) {
        registrar(usuario, tablaAfectada, idRegistro, accion, detalle, request, true);
    }

    public void fallo(UsuarioEntity usuario,
                      String tablaAfectada,
                      Integer idRegistro,
                      AccionLog accion,
                      String detalle,
                      HttpServletRequest request) {
        registrar(usuario, tablaAfectada, idRegistro, accion, detalle, request, false);
    }

    // ── Extracción de IP
    private String extraerIp(HttpServletRequest request) {
        if (request == null) return "Desconocida";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip))
            ip = request.getHeader("X-Real-IP");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip))
            ip = request.getRemoteAddr();
        if (ip != null && ip.contains(","))
            ip = ip.split(",")[0].trim();
        return ip;
    }
}