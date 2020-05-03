package ykrkn.es2.struct;

public class InvalidStructError extends RuntimeException {
    public InvalidStructError(Throwable e) {
        super(e);
    }

    public InvalidStructError(String message) {
        super(message);
    }
}
