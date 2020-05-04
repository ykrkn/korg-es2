package ykrkn.es2.midi;

public final class SysexExchangeError extends RuntimeException {

    public SysexExchangeError(Throwable cause) {
        super(cause);
    }

    public SysexExchangeError(String message) {
        super(message);
    }
}
