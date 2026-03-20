require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./app/models/User");
const { usertype } = require("./app/constants");

const adminEmail = process.env.ADMIN_EMAIL || "admin@eaturia.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const seedAdmin = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connection established.");

        if (!adminEmail || !adminPassword) {
            console.error("Please provide admin email and password.");
            process.exit(1);
        }

        // Check if SUPER_ADMIN already exists
        const existingAdmin = await User.findOne({ email: adminEmail }).lean();

        if (existingAdmin) {
            console.log(`SUPER_ADMIN with email "${adminEmail}" already exists.`);
            process.exit(0);
        }

        console.log(`Creating SUPER_ADMIN with email: ${adminEmail} ...`);

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create Admin user
        const newAdmin = new User({
            email: adminEmail,
            password: hashedPassword,
            type: usertype.SUPER_ADMIN,
            isActive: true
        });

        await newAdmin.save();

        console.log("SUPER_ADMIN created successfully!");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding the database:", error);
        process.exit(1);
    }
};

seedAdmin();
