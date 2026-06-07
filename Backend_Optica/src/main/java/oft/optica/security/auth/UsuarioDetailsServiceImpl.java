package oft.optica.security.auth;


import lombok.RequiredArgsConstructor;
import oft.optica.accesos.usuario.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Requerido por Spring Security para cargar el usuario durante la autenticación
@Service
@RequiredArgsConstructor
public class UsuarioDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByCorreoElectronico(username)
                .map(u -> {
                    // Toma el primer rol asignado; si no tiene, asigna ROLE_EMPLEADO
                    var authorities = u.getUsuarioRoles().stream()
                            .map(ur -> ur.getRol().getNombre())
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                    return User.builder()
                            .username(u.getCorreoElectronico())
                            .password(u.getContrasena())
                            .authorities(authorities)
                            .build();
                })
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }
}