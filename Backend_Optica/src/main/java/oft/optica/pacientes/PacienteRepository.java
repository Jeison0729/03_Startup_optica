package oft.optica.pacientes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<PacienteEntity, Integer> {

    @Query("SELECT paciente FROM PacienteEntity  paciente WHERE " +
            "(:nombreCompleto IS NULL OR LOWER(paciente.nombreCompleto) LIKE LOWER(CONCAT('%',:nombreCompleto,'%')))AND " +
            "(:numeroDocumento IS NULL OR paciente.numeroDocumento LIKE CONCAT('%',:numeroDocumento,'%')) AND " +
            "(:idEstado IS NULL OR paciente.estado.id = :idEstado)")
    Page<PacienteEntity> buscarConFiltros(
            @Param("nombreCompleto") String nombreCompleto,
            @Param("numeroDocumento") String numeroDocumento,
            @Param("idEstado") Integer idEstado,
            Pageable pageable);

    boolean existsByNumeroDocumento(String numeroDocumento);
}
