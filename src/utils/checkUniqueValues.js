export default function checkUniqueValues(model, values) {
  let i = 0;

  return new Promise((resolve, reject) => {
    // loop over values
    values.forEach(async data => {
      const key = Object.entries(data)[0][0];
      const value = Object.entries(data)[0][1];

      if (value) {
        // query the database for provided value
        const exists = await model.findOne({ [key]: value });

        if (exists) {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          reject(Error(`${capitalizedKey} is taken.`));
        }
      }

      i += 1;
      if (i === values.length) resolve();
    });
  });
}
