export const PatternBeatMap = {0:'16', 1:'32', 2:'8T', 3:'16T'};

export const NotesMap = {0:'C', 1:'C♯', 2:'D', 3:'D♯', 4:'E', 5:'F', 6:'F♯', 7:'G', 8:'G♯', 9:'A', 10:'A♯', 11:'B'};

export const PatternChordsetMap = {0:'1', 1:'2', 2:'3', 3:'4', 4:'5'};

export const PatternScaleMap = [
  [1, 'Chromatic', 'C, D♭, D, E♭, E, F, G♭, G, A♭, A, B♭, B'],
  [2, 'Ionian', 'C, D, E, F, G, A, B'],
  [3, 'Dorian', 'C, D, E♭, F, G, A, B♭'],
  [4, 'Phrygian', 'C, D♭, E♭, F, G, A♭, B♭'],
  [5, 'Lydian', 'C, D, E, F♯, G, A, B'],
  [6, 'Mixolydian', 'C, D, E, F, G, A, B♭'],
  [7, 'Aeolian', 'C, D, E♭, F, G, A♭, B♭'],
  [8, 'Locrian', 'C, D♭, E♭, F, G♭, A♭, B♭'],
  [9, 'Harmonic minor', 'C, D, E♭, F, G, A♭, B'],
  [10, 'Melodic minor', 'C, D, E♭, F, G, A, B'],
  [11, 'Major Blues', 'C, D, E♭, E, G, A'],
  [12, 'minor Blues', 'C, E♭, F, G♭, G, B♭'],
  [13, 'Diminished', 'C, D, E♭, F, F♯, G♯, A, B'],
  [14, 'Combination Dim', 'C, D♭, E♭, E, F♯, G, A, B♭'],
  [15, 'Major Penta', 'C, D, E, G, A'],
  [16, 'minor Penta', 'C, E♭, F, G, B♭'],
  [17, 'Raga 1 (Bhairav)', 'C, D♭, E, F, G, A♭, B'],
  [18, 'Raga 2 (Gamanasrama)', 'C, D♭, E, F♯, G, A, B'],
  [19, 'Raga 3 (Todi)', 'C, D♭, E♭, F♯, G, A♭, B'],
  [20, 'Arabic', 'C, D, E, F, G♭, A♭, B♭'],
  [21, 'Spanish', 'C, D♭, E♭, E, F, G, A♭, B♭'],
  [22, 'Gypsy', 'C, D, E♭, F♯, G, A♭, B'],
  [23, 'Egyptian', 'C, D, F, G, B♭'],
  [24, 'Hawaiian', 'C, D, E♭, G, A'],
  [25, 'Pelog', 'C, D♭, E♭, G, A♭'],
  [26, 'Japanese', 'C, D♭, F, G, A♭'],
  [27, 'Ryuku', 'C, E, F, G, B'],
  [28, 'Chinese', 'C, E, F♯, G, B'],
  [29, 'Bass Line', 'C, G, B♭'],
  [30, 'Whole Tone', 'C, D, E, G♭, A♭, B♭'],
  [31, 'Minor 3rd', 'C, E♭, G♭, A'],
  [32, 'Major 3rd', 'C, E, A♭'],
  [33, '4th Interval', 'C, F, B♭'],
  [34, '5th Interval', 'C, G'],
  [35, 'Octave', 'C'],
].map(e => [e[0]-1, e[1], e[2]]);