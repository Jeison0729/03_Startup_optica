package oft.optica.consultas.acompanantes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcompananteRepository extends JpaRepository<AcompananteEntity, Integer> {

    List<AcompananteEntity> findByConsultaId(Integer idConsulta);
}
