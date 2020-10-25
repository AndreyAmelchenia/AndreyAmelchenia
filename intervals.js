const INTERVALS = {
  m2: [1, 2],
  M2: [2, 2],
  m3: [3, 3],
  M3: [4, 3],
  P4: [5, 4],
  P5: [7, 5],
  m6: [8, 6],
  M6: [9, 6],
  m7: [10, 7],
  M7: [11, 7],
  P8: [12, 8],
};

const SEMITONES = ['C', '-', 'D', '-', 'E', 'F', '-', 'G', '-', 'A', '-', 'B'];

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const possibleNotesForConstruction = ['Cb', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'E#', 'Fb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'B#'];

const possibleNotesForIdentification = ['Cbb', 'Cb', 'C', 'C#', 'C##', 'Dbb', 'Db', 'D', 'D#', 'D##', 'Ebb', 'Eb', 'E', 'E#', 'E##', 'Fbb', 'Fb', 'F', 'F#', 'F##', 'Gbb', 'Gb', 'G', 'G#', 'G##', 'Abb', 'Ab', 'A', 'A#', 'A##', 'Bbb', 'Bb', 'B', 'B#', 'B##'];

const signFunc = (semitones, countSemitones, factor = 1) => semitones === countSemitones 
  ? ['']
  : factor * semitones > factor * countSemitones 
    ? new Array(factor * semitones - factor * countSemitones).fill('#') 
    : new Array(factor * countSemitones - factor * semitones).fill('b');

const singArr = (startInt, endInt, sign, semitones, factor = 1) => {
  let countSemitones = factor * endInt >= factor * startInt 
    ? factor * (endInt - startInt) 
    : factor * (endInt - startInt) + SEMITONES.length;
  if (sign === 'b') {
    countSemitones += factor;
    return signFunc(semitones, countSemitones, factor);
  };
  if (sign === '#') {
    countSemitones -= factor;
    return signFunc(semitones, countSemitones, factor);
  };
  return signFunc(semitones, countSemitones, factor);
  
}

const positionNote =  (note) => {
  const arrNote = note.split('');
  if(arrNote.length > 1) {
    if (arrNote[1] === 'b') {
      return SEMITONES.indexOf(arrNote[0]) - arrNote.length + 1
    } else if (arrNote[1] === '#') {
      return SEMITONES.indexOf(arrNote[0]) + arrNote.length - 1
    }
  } else {
    return SEMITONES.indexOf(arrNote[0])
  }
}

function intervalConstruction([interval, startInterval, stream = 'asc']) {
  if (!Object.keys(INTERVALS).includes(interval)) throw new Error('no interval');
  if (!possibleNotesForConstruction.includes(startInterval)) throw new Error('no start note');
  const degrees = INTERVALS[interval][1] - 1;
  const semitones = INTERVALS[interval][0];
  const start = NOTES.indexOf(startInterval.split('')[0]);
  const startInt = SEMITONES.indexOf(startInterval.split('')[0]);
  const sign = startInterval.split('')[1];
  if (stream === 'asc') {
    const end = (start + degrees) > NOTES.length 
      ? start + degrees - NOTES.length 
      : start + degrees;
    const endInt = SEMITONES.indexOf(NOTES[end]);
    return `${NOTES[end]}${singArr(startInt, endInt, sign, semitones).join('')}`
  } else if (stream === 'dsc') {
    const end = (start - degrees ) < 0 
      ? start - degrees + NOTES.length 
      : start - degrees;
    const endInt = SEMITONES.indexOf(NOTES[end]);
    return `${NOTES[end]}${singArr(startInt, endInt, sign, semitones, -1).join('')}`;
  }
};

function intervalIdentification([startInterval, endInterval, stream = 'asc']) {
  if (!possibleNotesForIdentification.includes(startInterval)) throw new Error('no start note');
  if (!possibleNotesForIdentification.includes(startInterval)) throw new Error('no end note');
  const startInt = positionNote(startInterval);
  const endInt = positionNote(endInterval);
  if (stream === 'asc') {
    const lengthInt = endInt - startInt > 0 
      ? endInt - startInt 
      : endInt - startInt + SEMITONES.length;
      return Object.keys(INTERVALS).find(el => INTERVALS[el][0] === lengthInt);
  } else if (stream === 'dsc') {
    const lengthInt = startInt - endInt > 0 
      ? startInt - endInt 
      : startInt - endInt + SEMITONES.length;
    return Object.keys(INTERVALS).find(el => INTERVALS[el][0] === lengthInt);
  }
};
