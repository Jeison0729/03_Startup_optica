package oft.optica.exception;

public class CuentaBloqueadaException extends RuntimeException {
    public CuentaBloqueadaException() {
        super("Cuenta bloqueada");
    }
}