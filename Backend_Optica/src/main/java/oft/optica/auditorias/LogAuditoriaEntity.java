package oft.optica.auditorias;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import oft.optica.accesos.usuario.UsuarioEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_log")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogAuditoriaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tabla_afectada", length = 64, nullable = false)
    private String tablaAfectada;

    @Column(name = "id_registro", nullable = false)
    private Integer registro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

    @Column(name = "usuario_nombre", length = 64)
    private String usuarioNombre;

    @Column(name = "ip", length = 45)
    private String ip;

    @Column(name = "accion", nullable = false, length = 64)
    private String accion;

    @Column(name = "detalle")
    private String detalle;

    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    @PrePersist
    protected void onCreate() {
        this.fechaEvento = LocalDateTime.now();
    }

    @Column(name = "resultado", columnDefinition = "SMALLINT")
    private Byte resultado;
}
