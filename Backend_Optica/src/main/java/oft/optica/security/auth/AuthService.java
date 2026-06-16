package oft.optica.security.auth;

import lombok.RequiredArgsConstructor;
import oft.optica.accesos.estado_usuario.EstadoUsuario;
import oft.optica.accesos.estado_usuario.EstadoUsuarioRepository;
import oft.optica.accesos.usuario.UsuarioEntity;
import oft.optica.accesos.usuario.UsuarioRepository;
import oft.optica.auditorias.AccionLog;
import oft.optica.auditorias.LogAuditoriaService;
import oft.optica.exception.CredencialesInvalidasException;
import oft.optica.exception.CuentaBloqueadaException;
import oft.optica.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LogAuditoriaService logService;
    private final EstadoUsuarioRepository estadoUsuarioRepository;

    private static final int MAX_INTENTOS = 3;

    public LoginResponse login(LoginRequest request, String ip) {


        // 1. Buscar por correo
        UsuarioEntity usuario = usuarioRepository
                .findByCorreoElectronico(request.correoElectronico())
                .orElseThrow(() -> {
                    logService.registrar(null, "usuarios", null,
                            AccionLog.LOGIN_FALLIDO,
                            "Correo no encontrado: " + request.correoElectronico(),
                            ip, false);
                    return new CredencialesInvalidasException();
                });                                          // ← aquí cierra el orElseThrow

        // 2. Resetear intentos si pasaron más de 24 horas
        if (usuario.getIntentosFallidos() > 0 && usuario.getFechaUltimoIntento() != null) {
            if (usuario.getFechaUltimoIntento().isBefore(LocalDateTime.now().minusHours(24))) {
                usuario.setIntentosFallidos((byte) 0);
                usuario.setFechaUltimoIntento(null);
                usuario.setEstadoUsuario(buscarEstadoUsuario("ACTIVO"));
                usuarioRepository.save(usuario);
            }
        }

        // 3. Verificar si está bloqueado
        if ("BLOQUEADO".equals(usuario.getEstadoUsuario().getCodigo())) {
            logService.registrar(usuario, "usuarios", usuario.getId(),
                    AccionLog.CUENTA_BLOQUEADA,
                    "Intento de login con cuenta bloqueada",
                    ip, false);
            throw new CuentaBloqueadaException();
        }

        // 4. Verificar contraseña
        if (passwordEncoder.matches(request.contrasena(), usuario.getContrasena())) {

            usuario.setIntentosFallidos((byte) 0);
            usuario.setFechaUltimoIntento(null);
            usuarioRepository.save(usuario);

            // Códigos para el JWT ("ROLE_DEV")
            var rolesCodigo = usuario.getUsuarioRoles().stream()
                    .map(ur -> ur.getRol().getCodigo())
                    .toList();

            // Nombres para la respuesta JSON ("Desarrollador")
            var rolesNombre = usuario.getUsuarioRoles().stream()
                    .map(ur -> ur.getRol().getNombre())
                    .toList();
            logService.registrar(usuario, "usuarios", usuario.getId(),
                    AccionLog.LOGIN_OK,
                    "Login exitoso",
                    ip, true);

            String token = jwtService.generarToken(
                    usuario.getCorreoElectronico(),
                    rolesCodigo
            );

            return new LoginResponse(
                    usuario.getId(),
                    token,
                    usuario.getUsuarioNombre(),
                    String.join(",", rolesCodigo)
            );
        } else {

            byte intentos = (byte) (usuario.getIntentosFallidos() + 1);
            usuario.setIntentosFallidos(intentos);
            usuario.setFechaUltimoIntento(LocalDateTime.now());

            if (intentos >= MAX_INTENTOS) {
                usuario.setEstadoUsuario(buscarEstadoUsuario("BLOQUEADO"));
                usuarioRepository.save(usuario);
                logService.registrar(usuario, "usuarios", usuario.getId(),
                        AccionLog.CUENTA_BLOQUEADA,
                        "Bloqueado automáticamente por " + MAX_INTENTOS + " intentos fallidos",
                        ip, false);
                throw new CuentaBloqueadaException();
            }

            usuarioRepository.save(usuario);

            logService.registrar(usuario, "usuarios", usuario.getId(),
                    AccionLog.LOGIN_FALLIDO,
                    "Contraseña incorrecta. Intento " + intentos + " de " + MAX_INTENTOS,
                    ip, false);

            throw new CredencialesInvalidasException();
        }
    }                                                        // ← aquí cierra login()

    private EstadoUsuario buscarEstadoUsuario(String codigo) {
        return estadoUsuarioRepository.findByCodigo(codigo)
                .orElseThrow(() ->
                        new RuntimeException("Estado usuario no encontrado: " + codigo));
    }
}                                                            // ← aquí cierra la clase
