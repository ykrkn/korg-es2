package ykrkn.es2.api;

public class InvalidStructError extends RuntimeException {
    public InvalidStructError(Throwable e) {
        super(e);
    }

    public InvalidStructError(String message) {
        super(message);
    }
}
