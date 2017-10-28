var fs = require('fs');

const PATTERNS_OFFSET = 0x10100;
const PATTERN_BLOCK_SIZE = 16384;
const NAME_OFFSET = 15;
const NAME_SIZE = 16; // null terminated
const TEMPO_OFFSET = 34;
const SWING_OFFSET = 36;
const LENGTH_OFFSET = 37;
const BEAT_OFFSET = 38;
const KEY_OFFSET = 39;
const SCALE_OFFSET = 40;
const CHORSET_OFFSET = 41;
const PLAY_LEVEL_OFFSET = 42;

/*
| 36          | Swing             | -48 ~ 48                             |
+-------------+-------------------+--------------------------------------+
| 37          | Length            | 0~3 = 1~4bar(s)                      |
+-------------+-------------------+--------------------------------------+
| 38          | Beat              | 0, 1, 2, 3 = 16,32,8 Tri, 16 Tri     |
+-------------+-------------------+--------------------------------------+
| 39          | Key               | 0~11 = C~B                           |
+-------------+-------------------+--------------------------------------+
| 40          | Scale             | 0~35                                 |
+-------------+-------------------+--------------------------------------+
| 41          | Chordset          | 0~4                                  |
+-------------+-------------------+--------------------------------------+
| 42          | Play Level        | 127 ~ 0 = 0 ~ 127                    |
*/

function read_pattern(buf, pos) {
	console.log('NAME:  ', buf.toString('ascii', pos+NAME_OFFSET, pos+NAME_OFFSET+NAME_SIZE));
	console.log('BPMx10:', buf.readUInt16LE(pos+TEMPO_OFFSET));
	console.log('Swing:', buf.readUInt8(pos+SWING_OFFSET));
	console.log('Length:', buf.readUInt8(pos+LENGTH_OFFSET));
	console.log('Beat:', buf.readUInt8(pos+BEAT_OFFSET));
	console.log('Key:', buf.readUInt8(pos+KEY_OFFSET));
	console.log('Scale:', buf.readUInt8(pos+SCALE_OFFSET));
	console.log('Chordset:', buf.readUInt8(pos+CHORSET_OFFSET));
	console.log('Play Level:', buf.readUInt8(pos+PLAY_LEVEL_OFFSET));
}

fs.readFile('data.bin', (err, buf) => {
	if (err) throw err;
	// console.log(buf.length);

	for(var p=PATTERNS_OFFSET; p<buf.length; p+=PATTERN_BLOCK_SIZE) {
		read_pattern(buf, p);
		break;
	}
});
