package ykrkn.es2.midi;

public class SysexActionError extends RuntimeException {

    private final int sysexCode;

    public int getSysexCode() {
        return sysexCode;
    }

    public SysexActionError(String message, int sysexCode) {
        super(message);
        this.sysexCode = sysexCode;
    }
}
