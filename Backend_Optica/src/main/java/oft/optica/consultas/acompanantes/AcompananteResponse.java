package oft.optica.consultas.acompanantes;

public record AcompananteResponse(

        Integer id,

        Integer idConsulta,

        String nombre,

        String parentesco,

        String telefono
) {
}
