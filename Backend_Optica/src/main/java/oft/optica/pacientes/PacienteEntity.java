package oft.optica.pacientes;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import oft.optica.catalogos.eps.EpsEntity;
import oft.optica.catalogos.estado_paciente.EstadoPacienteEntity;
import oft.optica.catalogos.tipo_documento.TipoDocumentoEntity;
import oft.optica.consultas.ConsultaEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_documento", nullable = false)
    private TipoDocumentoEntity tipoDocumento;

    @Column(name = "numero_documento", nullable = false, unique = true, length = 20)
    private String numeroDocumento;

    @Column(name = "nombre_completo", nullable = false, length = 128)
    private String nombreCompleto;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "sexo", nullable = false, length = 1)
    private String genero;

    @Column(name = "estado_civil", length = 32)
    private String estadoCivil;

    @Column(name = "ocupacion", length = 64)
    private String ocupacion;

    @Column(name = "direccion", length = 128)
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_eps")
    private EpsEntity eps;

    @Column(name = "tipo_vinculacion", length = 32)
    private String vinculacion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado", nullable = false)
    private EstadoPacienteEntity estado;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @JsonIgnore
    @OneToMany(mappedBy = "paciente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ConsultaEntity> consultas;

}
