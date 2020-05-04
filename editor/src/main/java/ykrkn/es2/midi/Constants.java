package ykrkn.es2.midi;

public class Constants {
    public static final int SYSTEM_EXCLUSIVE = 0xF0; // 240
    public static final int END_OF_EXCLUSIVE = 0xF7; // 247

    public static final int KORG_SX_ID = 0x42;

    public static final int SEARCH_DEVICE_FUNC = 0x50;
    public static final int SEARCH_DEVICE_REQ  = 0x00;
    public static final int SEARCH_DEVICE_RES  = 0x01;

    public static final int CURRENT_PATTERN_DUMP_REQ = 0x10;
    public static final int CURRENT_PATTERN_DUMP_RES = 0x40;
    public static final int DATA_LOAD_ERROR_RES = 0x24;
}
