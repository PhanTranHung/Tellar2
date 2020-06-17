async function access_db(req, res = null) {
  return new Promise((resolve, reject) => {
    if (req) resolve("successfully");
    else reject("failure");
  })
}

console.log(access_db(1).then(result => console.log(result)));