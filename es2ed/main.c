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

    korg_e2_pattern ptn;
    for(int i=0; i<PATTERNS_COUNT; ++i) {
        ptn = p[i];
        printf("pattern [%s]\nlet data=[", ptn.name);
        byte *a = &(ptn);
        for(int j=0; j<PATTERN_SIZE; ++j) {
            if(j>0) printf(",");
            if(j%32==0) printf("\n");
            printf("0x%02x", *(a+j));    
        }
        printf("];\n");
    }

    return 0;
}
