package oft.optica.exception;

// Para: solicitud ya procesada, no requiere reenvío, límite alcanzado
public class OperacionInvalidaException extends RuntimeException {
    public OperacionInvalidaException(String mensaje) {
        super(mensaje);
    }
}
