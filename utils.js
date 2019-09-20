// constrain number between a min and max
const constrain = (n , min, max) => Math.max(Math.min(n, max), min);

// constrain number between two other numbers
const between = (n, start, stop) => {
    return start < stop ?
    constrain(n, start, stop) :
    constrain(n, stop, start)
}

// map number between ranges
const map = (n, start1, stop1, start2, stop2, withinBounds) => {
  return [(n - start1) / (stop1 - start1) * (stop2 - start2) + start2]
  .map(val => withinBounds ? val : between(val, start2, stop2))
  .reduce(val => val)
}

// pick random number in range
const randomBetween = (min, max, int = false) => {
    return [Math.random() * (max - min) + min]
    .map(n => int ? Math.round(n) : n)
    .reduce(n => n)
}

// pick random element from a list
const pickFromList = (list) => list[randomBetween(0, list.length - 1, true)]

// convert color hex to rgba
const hexToRgba = (hex, opacity) => {
    let h=hex.replace('#', '');
    h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

    for (let i=0; i<h.length; i++) {
        h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);
    }

    if (typeof opacity != 'undefined')  h.push(opacity);

    return 'rgba('+h.join(',')+')';
}

export {
    between,
    hexToRgba,
    map,
    pickFromList,
    randomBetween
}