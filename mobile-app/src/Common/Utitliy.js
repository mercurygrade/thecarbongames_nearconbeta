import humanizeDuration from "humanize-duration"

export const capitalizeFirstLetter = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'null'

export const formatDuration = (duration, params = {}) => {
  return humanizeDuration(duration * 1000, {
    language: 'shortEn',
    conjunction: ' and ',
    largest: 1,
    languages: {
      shortEn: {
        h: () => "hour",
        m: () => "min",
        s: () => "sec"
      },
    },
    ...params
  })
}

export const getInitials = (name) => {
  if (!name) return null
  return name.split(' ').map(str => str.charAt(0).toUpperCase())
}


export const getCenter = (defaultParams) => {
  const origin = { latitude: parseFloat(defaultParams.origin.split(',')[0]), longitude: parseFloat(defaultParams.origin.split(',')[1]) }
  const destination = { latitude: parseFloat(defaultParams.destination.split(',')[0]), longitude: parseFloat(defaultParams.destination.split(',')[1]) }
  const centerCoordinates = { latitude: (origin.latitude + destination.latitude) / 2, longitude: (origin.longitude + destination.longitude) / 2 }
  return centerCoordinates
}


export const swapArray = (arr, order, selector) => {
  const newOrder = [];
  for (let i = 0, j = 0; i < arr.length; i++) {
    const element = arr[i];
    if (selector(element)) {
      newOrder.push(arr.indexOf(arr.filter((a) => selector(a))[order[j]]));
      j++;
    } else newOrder.push(i);
  }

  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const newIndex = newOrder[i];
    newArr.push(arr[newIndex]);
  }
  return newArr;
};
