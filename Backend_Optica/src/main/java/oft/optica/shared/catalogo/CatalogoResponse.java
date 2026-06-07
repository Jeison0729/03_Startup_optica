package oft.optica.shared.catalogo;

public record CatalogoResponse(
        Integer id,
        String codigo,
        String nombre,
        String descripcion
) {
}
