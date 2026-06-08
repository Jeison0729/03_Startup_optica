package oft.optica.consultas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import oft.optica.accesos.usuario.UsuarioEntity;
import oft.optica.catalogos.estado_consulta.EstadoConsultaEntity;
import oft.optica.consultas.acompanantes.AcompananteEntity;
import oft.optica.consultas.archivos.ArchivoAdjuntoEntity;
import oft.optica.consultas.mediciones.MedicionOptometricaEntity;
import oft.optica.pacientes.PacienteEntity;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "consultas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private PacienteEntity paciente;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_optometra", nullable = false)
    private UsuarioEntity optometra;

    @Column(name = "fecha_consulta", insertable = false, updatable = false)
    private LocalDateTime fechaConsulta;

    // Anamnesis

    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;

    @Column(name = "ultimo_control", length = 128)
    private String ultimoControl;

    @Column(name = "ant_personales", columnDefinition = "TEXT")
    private String antecedentes;

    @Column(name = "ant_familiares", columnDefinition = "TEXT")
    private String antecedentesFamiliares;

    // Hallazgos clinicos

    @Column(name = "examen_externo", columnDefinition = "TEXT")
    private String examenExterno;

    @Column(name = "tonometria_od", length = 16)
    private String tonometriaOd;

    @Column(name = "tonometria_oi", length = 16)
    private String tonometriaOi;

    @Column(name = "test_color", length = 64)
    private String testColor;

    @Column(name = "fondo_ojo", columnDefinition = "TEXT")
    private String fondoOjo;

    // Cierre

    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "conducta", columnDefinition = "TEXT")
    private String conducta;

    @Column(name = "control_sugerido", length = 128)
    private String controlSugerido;

    @Column(name = "remision", length = 128)
    private String remision;

    // Control de Flujo

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_consulta", nullable = false)
    private EstadoConsultaEntity estado;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @OneToOne(mappedBy = "consulta", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private MedicionOptometricaEntity medicion;

    @OneToMany(mappedBy = "consulta", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AcompananteEntity> acompanantes;

    @OneToMany(mappedBy = "consulta", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ArchivoAdjuntoEntity> archivoAdjuntos;
}
