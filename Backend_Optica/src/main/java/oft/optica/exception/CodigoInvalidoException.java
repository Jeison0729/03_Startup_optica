package oft.optica.exception;

// Para: código inválido o expirado
public class CodigoInvalidoException extends RuntimeException {
    public CodigoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
