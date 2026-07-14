package oft.optica.auditorias;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogAuditoriaRepository extends JpaRepository<LogAuditoriaEntity, Integer>, JpaSpecificationExecutor<LogAuditoriaEntity> {


    @Query("SELECT log FROM LogAuditoriaEntity log WHERE " +
            "(:tablaAfectada IS NULL OR log.tablaAfectada = :tablaAfectada) AND " +
            "(:registro IS NULL OR log.registro = :registro) AND " +
            "(:idUsuario IS NULL OR log.usuario.id = :idUsuario) AND " +
            "(:accion IS NULL OR log.accion = :accion) AND " +
            "(:resultado IS NULL OR log.resultado = :resultado) AND " +
            "(:desde IS NULL OR log.fechaEvento >= :desde) AND " +
            "(:hasta IS NULL OR log.fechaEvento <= :hasta)")
    Page<LogAuditoriaEntity> buscarConFiltros(
            @Param("tablaAfectada") String tablaAfectada,
            @Param("registro") Integer registro,
            @Param("idUsuario") Integer idUsuario,
            @Param("accion") String accion,
            @Param("resultado") Byte resultado,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);

    long countByFechaEventoBetween(LocalDateTime inicio, LocalDateTime fin);

    List<LogAuditoriaEntity> findTop8ByOrderByFechaEventoDesc();

}
