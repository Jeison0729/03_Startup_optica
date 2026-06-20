package oft.optica.consultas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ConsultaRepository extends JpaRepository<ConsultaEntity, Integer> {

    @Query("""
            SELECT c FROM ConsultaEntity c
            JOIN FETCH c.paciente
            JOIN FETCH c.optometra
            JOIN FETCH c.estado
            WHERE (:idPaciente IS NULL OR c.paciente.id = :idPaciente)
              AND (:idEstado   IS NULL OR c.estado.id   = :idEstado)
              AND (CAST(:desde AS localdatetime) IS NULL OR c.fechaConsulta >= :desde)
              AND (CAST(:hasta AS localdatetime) IS NULL OR c.fechaConsulta <= :hasta)
            """)
    Page<ConsultaEntity> buscarConFiltros(
            @Param("idPaciente") Integer idPaciente,
            @Param("idEstado") Integer idEstado,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);

    @Query("""
            SELECT consulta FROM ConsultaEntity consulta
            JOIN FETCH consulta.paciente paciente
            JOIN FETCH consulta.optometra optometra
            JOIN FETCH consulta.estado estado
            LEFT JOIN FETCH consulta.medicion medicion
            LEFT JOIN FETCH medicion.material material
            LEFT JOIN FETCH medicion.tipoLente tipoLente
            LEFT JOIN FETCH consulta.archivoAdjuntos archivos
            WHERE paciente.id = :idPaciente
            ORDER BY consulta.fechaConsulta DESC
            """)
    List<ConsultaEntity> buscarHistorialPorPaciente(@Param("idPaciente") Integer idPaciente);

    long countByEstadoCodigo(String codigo);

    long countByFechaConsultaBetween(LocalDateTime inicio, LocalDateTime fin);
}
