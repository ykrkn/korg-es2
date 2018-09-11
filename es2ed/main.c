//  gcc main.c && ./a.out ../assets/data.bin /tmp/out.json
//
//  main.c
//  es2ed
//  
//  Created by sx on 28.10.17.
//  Copyright © 2017 sx. All rights reserved.
//

#include <stdio.h>
#include <string.h>
#include "korg_e2.h"

#define PATTERNS_FILE_OFFSET 0x10100
#define PATTERNS_COUNT 250
#define PATTERN_SIZE sizeof(korg_e2_pattern)

int uint16le (const byte * p) {
    int lo = (*p & 0x0F);
    int hi = (*(p+1) & 0x0F);
    return (hi << 8) | lo;
}

void print_step(FILE *fout, korg_e2_step step) {
    fprintf(fout, "{\"step_on\":%d, \"gate_time\":%d, \"velocity\":%d, \"trigger_on\":%d, ", 
        step.step_on_off, step.step_gate_time, step.step_velocity, step.step_trigger_on_off);  
    fprintf(fout, "\"notes\":[%d,%d,%d,%d]", step.step_note_slot1-1, step.step_note_slot2-1, step.step_note_slot3-1, step.step_note_slot4-1);   
    fprintf(fout, "}"); 
}

void print_part(FILE *fout, korg_e2_part part) {
    fprintf(fout, "{\"last_step\":%d, \"oscillator_type\":%d, \"steps\":[", (part.last_step == 0 ? 16 : part.last_step), uint16le(part.oscillator_type));
    for(int k=0; k<64; ++k) { // steps 
        if (k > 0) fprintf(fout, ",");
        print_step(fout, part.steps[k]);  
    }
    fprintf(fout, "]");
    fprintf(fout, "}"); 
}

void print_pattern(FILE *fout, korg_e2_pattern ptn) {
    fprintf(fout, "{\"name\":\"%s\", \"tempo\":%.1f, ", ptn.name, uint16le(ptn.tempo)*0.1);
    fprintf(fout, "\"length\":%d, \"beat\":%d, \"key\":%d, \"scale\":%d, \"chordset\":%d, \"level\":%d, \"parts\":[", 
          ptn.length+1, ptn.beat, ptn.key, ptn.scale, ptn.chordset,127-ptn.level);

    for(int j=0; j<16; ++j) { // parts
        if (j > 0) fprintf(fout, ",");
        //print_part(fout, ptn.parts[j]);
    }
    fprintf(fout, "]");
    fprintf(fout, "}");
}

int main(int argc, const char * argv[]) {
    if (argc < 3) {
        printf("Usage: %s file_in file_out\n", argv[0]);
        return 0;
    }

    printf("Read dump from %s into %s\n", argv[1], argv[2]);

    korg_e2_pattern p[PATTERNS_COUNT];
    //fprintf(fout, "%lu\n", PATTERN_SIZE);
    
    FILE *fptr = fopen(argv[1], "r");

    if (fptr == NULL) {
        printf("File %s could not be opened, exiting program.\n", argv[1]);
        return 0;
    }

    FILE *fout = fopen(argv[2], "w");

    if (fout == NULL) {
        printf("File %s could not be opened, exiting program.\n", argv[2]);
        return 0;
    }

    fseek(fptr, PATTERNS_FILE_OFFSET, SEEK_SET);
    while (!feof(fptr)) {
        fread(&p, PATTERN_SIZE, PATTERNS_COUNT, fptr);
    }
    fclose(fptr);

    fprintf(fout, "[");
    for(int i=0; i<PATTERNS_COUNT; ++i) {
        if (i > 0) fprintf(fout, ",");
        print_pattern(fout, p[i]);
    }
    fprintf(fout, "]\n");
    fclose(fout);
    return 0;
}
