export default function shuffleArray(array) {
  const oldArray = [...array];
  const newArray = [];

  for (let i = 0; i < array.length; i += 1) {
    const index = Math.floor(Math.random() * oldArray.length);

    newArray.push(oldArray[index]);
    oldArray.splice(index, 1);
  }

  return newArray;
}
