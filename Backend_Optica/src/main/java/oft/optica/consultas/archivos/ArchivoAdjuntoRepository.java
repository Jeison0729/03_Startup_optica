package oft.optica.consultas.archivos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchivoAdjuntoRepository extends JpaRepository<ArchivoAdjuntoEntity, Integer> {

    List<ArchivoAdjuntoEntity> findByConsultaId(Integer consulta);


}
