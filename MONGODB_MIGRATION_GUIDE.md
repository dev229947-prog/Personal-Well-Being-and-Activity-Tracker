# MongoDB Migration Guide

## Changes Completed ✅

1. **database.js** - Updated to use MongoDB connection with provided credentials
2. **package.json** - Replaced Sequelize & SQLite with MongoDB driver
3. **models.js** - Converted Sequelize models to MongoDB collection structure
4. **server.js** - Updated to connect to MongoDB and create indexes on startup
5. **routes/auth.js** - Example: Converted signup/login to MongoDB queries

## MongoDB Connection Details

```
Database: wellbeing_tracker
Connection: mongodb+srv://dev229947_db_user:1KWDiTwo4wHklS3V@cluster0.zf5vzlv.mongodb.net/?retryWrites=true&w=majority&appName=cluster0
```

## How to Convert Other Routes - Pattern Reference

### Old Sequelize Pattern:
```javascript
const { User } = require("../models");
const user = await User.findOne({ where: { username } });
const newUser = await User.create({ username, email });
```

### New MongoDB Pattern:
```javascript
const { getCollections } = require("../models");
const collections = await getCollections();
const user = await collections.users.findOne({ username });
const result = await collections.users.insertOne({ username, email, createdAt: new Date() });
```

## Key MongoDB Query Methods to Replace

| Sequelize | MongoDB |
|-----------|---------|
| `Model.findOne({where: {...}})` | `collection.findOne({...})` |
| `Model.findAll({where: {...}})` | `collection.find({...}).toArray()` |
| `Model.create({...})` | `collection.insertOne({...})` |
| `Model.update({...}, {where: {...}})` | `collection.updateOne({...}, {$set: {...}})` |
| `Model.destroy({where: {...}})` | `collection.deleteOne({...})` |
| `where: { [Op.or]: [...] }` | `{$or: [...]}` |
| `where: { id: 5 }` | `{_id: ObjectId("...")}` or use string field |

## Complex Query Examples

### Finding with multiple conditions (AND):
```javascript
// Old Sequelize:
const records = await Record.findAll({ where: { user_name: "john", date: "2024-01-01" } });

// New MongoDB:
const records = await collections.records.find({ user_name: "john", date: "2024-01-01" }).toArray();
```

### Finding with OR:
```javascript
// Old Sequelize:
const user = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });

// New MongoDB:
const user = await collections.users.findOne({ $or: [{ username }, { email }] });
```

### Updates:
```javascript
// Old Sequelize:
await Goal.update({ current_value: 50 }, { where: { id: 1 } });

// New MongoDB:
const { ObjectId } = require("mongodb");
await collections.goals.updateOne({ _id: ObjectId(id) }, { $set: { current_value: 50 } });
```

### Delete:
```javascript
// Old Sequelize:
await Goal.destroy({ where: { id: 1 } });

// New MongoDB:
const { ObjectId } = require("mongodb");
await collections.goals.deleteOne({ _id: ObjectId(id) });
```

## Routes Still Needing Conversion

Update these files using the pattern above:
- [ ] routes/activities.js
- [ ] routes/bmi.js
- [ ] routes/dailytasks.js
- [ ] routes/goals.js
- [ ] routes/health.js
- [ ] routes/insights.js
- [ ] routes/journal.js
- [ ] routes/mood.js
- [ ] routes/nutrition.js
- [ ] routes/records.js
- [ ] routes/schedule.js
- [ ] routes/sleep.js
- [ ] routes/workouts.js

## Important Notes

1. **Remove migrate.js** - Not needed with MongoDB (schema-less)
2. **ObjectId imports** - Use `const { ObjectId } = require("mongodb");` when you need to query by _id
3. **Timestamps** - MongoDB doesn't auto-add timestamps, so include in insertOne/updateOne:
   ```javascript
   collection.insertOne({ ...data, createdAt: new Date(), updatedAt: new Date() });
   ```
4. **Environment Variables** - Move credentials to `.env` file for production:
   ```
   MONGODB_URI=mongodb+srv://dev229947_db_user:1KWDiTwo4wHklS3V@cluster0.zf5vzlv.mongodb.net/?retryWrites=true&w=majority&appName=cluster0
   ```

## Testing

Once all routes are converted, test by:
1. Start the server: `npm run dev`
2. Check MongoDB Atlas for created collections
3. Test API endpoints with Postman or curl

## Next Steps

1. Convert remaining routes (list above)
2. Test each endpoint after conversion
3. Verify data is persisting in MongoDB Atlas
4. Move credentials to `.env` file for security
