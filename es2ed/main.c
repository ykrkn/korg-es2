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

int main(int argc, const char * argv[]) {
    korg_e2_pattern p[250];
    //printf("%lu", sizeof(korg_e2_pattern));
    
    FILE *fptr;
    fptr = fopen("/Users/sx//Desktop/es2ed/assets/data.bin", "r");
    
    if (fptr == NULL) {
        printf("File could not be opened, exiting program.\n");
    } else {
        fseek(fptr, 0x10100, SEEK_SET);
        //while (!feof(fptr)) {
        //  16384
            fread(&p, sizeof(korg_e2_pattern), 250, fptr);
        //}
        fclose(fptr);
    }
    return 0;
}
