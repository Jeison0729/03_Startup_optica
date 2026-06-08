package oft.optica.consultas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;


@Repository
public interface ConsultaRepository extends JpaRepository<ConsultaEntity, Integer> {

    @Query("""
            SELECT c FROM ConsultaEntity c
            WHERE (:idPaciente IS NULL OR c.paciente.id = :idPaciente)
              AND (:idEstado   IS NULL OR c.estado.id   = :idEstado)
              AND (:desde      IS NULL OR c.fechaConsulta >= :desde)
              AND (:hasta      IS NULL OR c.fechaConsulta <= :hasta)
            ORDER BY c.fechaConsulta DESC
            """)
    Page<ConsultaEntity> buscarConFiltros(
            @Param("idPaciente") Integer idPaciente,
            @Param("idEstado") Integer idEstado,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);
}
