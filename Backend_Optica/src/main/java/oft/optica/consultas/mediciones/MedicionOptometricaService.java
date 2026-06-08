package oft.optica.consultas.mediciones;

import jakarta.servlet.http.HttpServletRequest;

public interface MedicionOptometricaService {

    MedicionOptometricaResponse crear(MedicionOptometricaRequest request, HttpServletRequest http);

    MedicionOptometricaResponse buscarPorConsulta(Integer idConsulta);

    MedicionOptometricaResponse buscarPorId(Integer id);

    MedicionOptometricaResponse actualizar(Integer id, MedicionOptometricaRequest request, HttpServletRequest http);
}
