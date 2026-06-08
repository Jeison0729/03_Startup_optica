package oft.optica.consultas.mediciones;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicionOptometricaRepository extends JpaRepository<MedicionOptometricaEntity, Integer> {

    Optional<MedicionOptometricaEntity> findByConsultaId(Integer idConsulta);

    boolean existsByConsultaId(Integer idConsulta);
}
