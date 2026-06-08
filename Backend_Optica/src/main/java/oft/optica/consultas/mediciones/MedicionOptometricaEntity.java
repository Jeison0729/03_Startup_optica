package oft.optica.consultas.mediciones;

import jakarta.persistence.*;
import lombok.*;
import oft.optica.catalogos.material.MaterialEntity;
import oft.optica.catalogos.tipo_lente.TipoLenteEntity;
import oft.optica.consultas.ConsultaEntity;

import java.math.BigDecimal;

@Entity
@Table(name = "mediciones_optometricas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicionOptometricaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta", nullable = false, unique = true)
    private ConsultaEntity consulta;

    // ── Rx en Uso ─────────────────────────────────────────────────────────
    @Column(name = "rx_uso_od_esfera", precision = 4, scale = 2)
    private BigDecimal rxUsoOdEsfera;

    @Column(name = "rx_uso_od_cilindro", precision = 4, scale = 2)
    private BigDecimal rxUsoOdCilindro;

    @Column(name = "rx_uso_od_eje")
    private Integer rxUsoOdEje;

    @Column(name = "rx_uso_od_av_vl", length = 16)
    private String rxUsoOdAvVl;

    @Column(name = "rx_uso_oi_esfera", precision = 4, scale = 2)
    private BigDecimal rxUsoOiEsfera;

    @Column(name = "rx_uso_oi_cilindro", precision = 4, scale = 2)
    private BigDecimal rxUsoOiCilindro;

    @Column(name = "rx_uso_oi_eje")
    private Integer rxUsoOiEje;

    @Column(name = "rx_uso_oi_av_vl", length = 16)
    private String rxUsoOiAvVl;

    // ── Visión Próxima ────────────────────────────────────────────────────
    @Column(name = "vp_od", length = 16)
    private String vpOd;

    @Column(name = "vp_oi", length = 16)
    private String vpOi;

    @Column(name = "lente_uso", length = 32)
    private String lenteUso;

    // ── Queratometría ─────────────────────────────────────────────────────
    @Column(name = "km_od", length = 64)
    private String kmOd;

    @Column(name = "km_od_observaciones")
    private String kmOdObservaciones;

    @Column(name = "km_oi", length = 64)
    private String kmOi;

    @Column(name = "km_oi_observaciones")
    private String kmOiObservaciones;

    // ── Refracción intermedia ─────────────────────────────────────────────
    @Column(name = "rx_od", length = 64)
    private String rxOd;

    @Column(name = "rx_od_observaciones")
    private String rxOdObservaciones;

    @Column(name = "rx_oi", length = 64)
    private String rxOi;

    @Column(name = "rx_oi_observaciones")
    private String rxOiObservaciones;

    // ── Modalidad ─────────────────────────────────────────────────────────
    @Column(name = "modalidad_ppc", length = 32)
    private String modalidadPpc;

    @Column(name = "modalidad_lejos", length = 32)
    private String modalidadLejos;

    @Column(name = "modalidad_cerca", length = 32)
    private String modalidadCerca;

    @Column(name = "test_titmus", length = 32)
    private String testTitmus;

    // ── Rx Final OD ───────────────────────────────────────────────────────
    @Column(name = "od_esfera", precision = 4, scale = 2)
    private BigDecimal odEsfera;

    @Column(name = "od_cilindro", precision = 4, scale = 2)
    private BigDecimal odCilindro;

    @Column(name = "od_eje")
    private Integer odEje;

    @Column(name = "od_av_vl", length = 16)
    private String odAvVl;

    // ── Rx Final OI ───────────────────────────────────────────────────────
    @Column(name = "oi_esfera", precision = 4, scale = 2)
    private BigDecimal oiEsfera;

    @Column(name = "oi_cilindro", precision = 4, scale = 2)
    private BigDecimal oiCilindro;

    @Column(name = "oi_eje")
    private Integer oiEje;

    @Column(name = "oi_av_vl", length = 16)
    private String oiAvVl;

    // ── Datos complementarios ─────────────────────────────────────────────
    @Column(name = "adicion", precision = 4, scale = 2)
    private BigDecimal adicion;

    @Column(name = "distancia_pupilar", length = 16)
    private String distanciaPupilar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_material")
    private MaterialEntity material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_lente")
    private TipoLenteEntity tipoLente;

    @Column(name = "observaciones_rx")
    private String observacionesRx;
}
