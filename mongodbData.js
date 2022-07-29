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

//Using the shortcut for converting the data
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

//Slicing arrays
db.manyFriends
  .aggregate([
    { $project: { _id: 0, examScore: { $slice: ["$examScores", 2, 1] } } },
    //{ $project: { _id: 0, examScore: { $slice: ["$examScores", -2] } } }
    //{ $project: { _id: 0, examScore: { $slice: ["$examScores", 2] } } }
  ])
  .pretty();

//Getting the length of the array
db.friends
  .aggregate([{ $project: { _id: 0, numScores: { $size: "$examScores" } } }])
  .pretty();

//Using filter operator
db.friends
  .aggregate([
    {
      $project: {
        _id: 0,
        scores: {
          $filter: {
            input: "$examScores",
            as: "sc",
            cond: { $gt: ["$$sc.score", 60] },
          },
        },
      },
    },
  ])
  .pretty();

//Applying multiple operations to an array
db.friends
  .aggregate([
    { $unwind: "$examScores" },
    { $project: { _id: 1, name: 1, age: 1, score: "$examScores.score" } },
    { $sort: { score: -1 } },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        maxScore: { $max: "$score" },
      },
    },
    { $sort: { maxScore: -1 } },
  ])
  .pretty();

//Working with bucket
db.persons
  .aggregate([
    {
      $bucket: {
        groupBy: "$dob.age",
        boundaries: [18, 30, 40, 50, 60, 120],
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: "$dob.age" },
        },
      },
    },
  ])
  .pretty();

db.persons
  .aggregate([
    {
      $bucketAuto: {
        groupBy: "$dob.age",
        buckets: 5,
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: "$dob.age" },
        },
      },
    },
  ])
  .pretty();

//Dividing into aditional stages
db.persons
  .aggregate([
    { $match: { gender: "male" } },
    {
      $project: {
        _id: 0,
        gender: 1,
        name: { $concat: ["$name.first", " ", "$name.last"] },
        birthdate: { $toDate: "$dob.date" },
      },
    },
    { $sort: { birthdate: 1 } },
    { $skip: 10 },
    { $limit: 10 },
  ])
  .pretty();

//For adding the transformed data to another collection
// { $out: "transformedPersons" }
