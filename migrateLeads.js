const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/leadModel');
const Customer = require('./models/customerModel');

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wrixty');
    console.log('Connected to DB');

    const leads = await mongoose.connection.collection('leads').find({ customer: { $exists: false } }).toArray();
    console.log(`Found ${leads.length} leads to migrate`);

    for (let lead of leads) {
      if (lead.name && lead.phone_number) {
        let customer = await Customer.findOne({ phone_number: lead.phone_number });
        if (!customer) {
          customer = await Customer.create({ name: lead.name, phone_number: lead.phone_number });
        }
        await mongoose.connection.collection('leads').updateOne(
          { _id: lead._id },
          { 
            $set: { customer: customer._id },
            $unset: { name: "", phone_number: "" }
          }
        );
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
