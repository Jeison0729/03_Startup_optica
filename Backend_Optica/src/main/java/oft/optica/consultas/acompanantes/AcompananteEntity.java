package oft.optica.consultas.acompanantes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import oft.optica.catalogos.parentesco.ParentescoEntity;
import oft.optica.consultas.ConsultaEntity;

@Entity
@Table(name = "acompanantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcompananteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta", nullable = false)
    private ConsultaEntity consulta;

    @Column(name = "nombre", nullable = false, length = 128)
    private String nombre;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_parentesco")
    private ParentescoEntity parentesco;

    @Column(name = "telefono", length = 20)
    private String telefono;
}
