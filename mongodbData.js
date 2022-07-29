// db.manyFriends.aggregate([{ $unwind: "$hobbies" }]);

//{$group: {_id: {age: "$age"}, allHobbies: {$push: "$hobbies"}}}

//MONGO DB Commands

//For gruping, the equivalent to Group By and finding statistics

db.persons
  .aggregate([
    { $match: { gender: "female" } },
    {
      $group: { _id: { state: "$location.state" }, totalPersons: { $sum: 1 } },
    },
  ])
  .pretty();

//For grouping and also sorting
db.persons
  .aggregate([
    { $match: { gender: "female" } },
    {
      $group: { _id: { state: "$location.state" }, totalPersons: { $sum: 1 } },
    },
    { $sort: { totalPersons: -1 } },
  ])
  .pretty();

//For grouping and converting the data to uppercase and so on
db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        gender: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
            {
              $substrCP: [
                "$name.first",
                1,
                { $subtract: [{ $strLenCP: "$name.first" }, 1] },
              ],
            },
            " ",
            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
            {
              $substrCP: [
                "$name.last",
                1,
                { $subtract: [{ $strLenCP: "$name.last" }, 1] },
              ],
            },
          ],
        },
      },
    },
  ])
  .pretty();

//Changing also the birthday and the date
db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        birthdate: { $convert: { input: "$dob.date", to: "date" } },
        age: "$dob.age",
        location: {
          type: "Point",
          coordinates: [
            {
              $convert: {
                input: "$location.coordinates.longitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
            {
              $convert: {
                input: "$location.coordinates.latitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        birthdate: 1,
        age: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
            {
              $substrCP: [
                "$name.first",
                1,
                { $subtract: [{ $strLenCP: "$name.first" }, 1] },
              ],
            },
            " ",
            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
            {
              $substrCP: [
                "$name.last",
                1,
                { $subtract: [{ $strLenCP: "$name.last" }, 1] },
              ],
            },
          ],
        },
      },
    },
  ])
  .pretty();

//Changing the location as well
db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        birthdate: { $toDate: "$dob.date" },
        age: "$dob.age",
        location: {
          type: "Point",
          coordinates: [
            {
              $convert: {
                input: "$location.coordinates.longitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
            {
              $convert: {
                input: "$location.coordinates.latitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        birthdate: 1,
        age: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
            {
              $substrCP: [
                "$name.first",
                1,
                { $subtract: [{ $strLenCP: "$name.first" }, 1] },
              ],
            },
            " ",
            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
            {
              $substrCP: [
                "$name.last",
                1,
                { $subtract: [{ $strLenCP: "$name.last" }, 1] },
              ],
            },
          ],
        },
      },
    },
  ])
  .pretty();

//Adding to hobbies array
db.friends
  .aggregate([
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, allHobbies: { $push: "$hobbies" } } },
  ])
  .pretty();
