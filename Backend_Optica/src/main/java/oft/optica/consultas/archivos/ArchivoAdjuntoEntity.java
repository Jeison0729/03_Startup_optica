package oft.optica.consultas.archivos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import oft.optica.consultas.ConsultaEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "archivos_adjuntos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArchivoAdjuntoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta", nullable = false)
    private ConsultaEntity consulta;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    private String nombreArchivo;

    @Column(name = "ruta_almacenamiento", nullable = false, length = 512)
    private String rutaAlmacenamiento;

    @Column(name = "tipo_contenido", length = 64)
    private String tipoContenido;

    @Column(name = "fecha_subida", insertable = false, updatable = false)
    private LocalDateTime fechaSubida;
}
