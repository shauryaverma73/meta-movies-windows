authorisation complete

Whenever we need to populate we use this
Movies
    .populate('reviews');

User
    .populate('watchList').populate('reviews');

Review
    no need already populated







When we populate an array of mongoose.Schema.objectId we must not use the middleware because it may cause errors. So, call the .populate method whenever we need when fetching data from database (using with .find method)