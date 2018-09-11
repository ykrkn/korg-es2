//  gcc main.c && ./a.out
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

void print_step(korg_e2_step step) {
    printf("{\"step_on\":%d, \"gate_time\":%d, \"velocity\":%d, \"trigger_on\":%d, ", 
        step.step_on_off, step.step_gate_time, step.step_velocity, step.step_trigger_on_off);  
    printf("\"notes\":[%d,%d,%d,%d]", step.step_note_slot1-1, step.step_note_slot2-1, step.step_note_slot3-1, step.step_note_slot4-1);   
    printf("}"); 
}

void print_part(korg_e2_part part) {
    printf("{\"last_step\":%d, \"oscillator_type\":%d, \"steps\":[", (part.last_step == 0 ? 16 : part.last_step), uint16le(part.oscillator_type));
    for(int k=0; k<64; ++k) { // steps 
        if (k > 0) printf(",");
        print_step(part.steps[k]);  
    }
    printf("]");
    printf("}"); 
}

void print_pattern(korg_e2_pattern ptn) {
    printf("{\"name\":\"%s\", \"tempo\":%.1f, ", ptn.name, uint16le(ptn.tempo)*0.1);
    printf("\"length\":%d, \"beat\":%d, \"key\":%d, \"scale\":%d, \"chordset\":%d, \"level\":%d, \"parts\":[", 
          ptn.length+1, ptn.beat, ptn.key, ptn.scale, ptn.chordset,127-ptn.level);

    byte *a = &(ptn);
    for(int j=0; j<16; ++j) { // parts
        if (j > 0) printf(",");
        print_part(ptn.parts[j]);
    }
    printf("]");
    printf("}");
}

int main(int argc, const char * argv[]) {
    korg_e2_pattern p[PATTERNS_COUNT];
    //printf("%lu\n", PATTERN_SIZE);
    
    FILE *fptr;
    fptr = fopen("/Users/yurykrikun/src/korg-es2/assets/data.bin", "r");
    
    if (fptr == NULL) {
        printf("File could not be opened, exiting program.\n");
        return 0;
    }

    fseek(fptr, PATTERNS_FILE_OFFSET, SEEK_SET);
    while (!feof(fptr)) {
        fread(&p, PATTERN_SIZE, PATTERNS_COUNT, fptr);
    }
    fclose(fptr);

    printf("[");
    for(int i=0; i<PATTERNS_COUNT; ++i) {
        if (i > 0) printf(",");
        print_pattern(p[i]);
    }
    printf("]\n");
    return 0;
}
