import { AdminDatabase } from "../AdminDatabase";
import readline from "readline";

const adminDb = new AdminDatabase();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateUsername = (username: string): boolean => {
  return username.trim().length >= 3;
};

const runAdminSeed = async () => {
  console.log("\n=== Admin User Seeder ===\n");
  console.log("⚠️  Note: Password will be visible while typing\n");

  try {
    let username = "";
    while (!username) {
      const input = await question("Enter username (min 3 characters): ");
      if (!validateUsername(input)) {
        console.error(
          "❌ Username must be at least 3 characters long. Please try again.\n",
        );
        continue;
      }
      const existingUsername = adminDb.findByUsername(input);
      if (existingUsername) {
        console.error(
          "❌ Admin user with this username already exists. Please try a different username.\n",
        );
        continue;
      }
      username = input;
    }

    let email = "";
    while (!email) {
      const input = await question("Enter email: ");
      if (!validateEmail(input)) {
        console.error(
          "❌ Please enter a valid email address. Please try again.\n",
        );
        continue;
      }

      const existingAdmin = adminDb.findByEmail(input);
      if (existingAdmin) {
        console.error(
          "❌ Admin user with this email already exists. Please try a different email.\n",
        );
        continue;
      }

      email = input;
    }

    let password = "";
    while (!password) {
      const input = await question("Enter password (min 6 characters): ");
      if (validatePassword(input)) {
        password = input;
      } else {
        console.error(
          "❌ Password must be at least 6 characters long. Please try again.\n",
        );
      }
    }

    console.log("\n⏳ Creating admin user...\n");

    const newAdmin = await adminDb.createAdmin(username, email, password);

    console.log("✅ Admin user created successfully!");
    console.log("\nDetails:");
    console.log("  ID:", newAdmin.id);
    console.log("  Username:", newAdmin.username);
    console.log("  Email:", newAdmin.email);
    console.log("  Created at:", newAdmin.createdAt);
    console.log();

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    console.error(error instanceof Error ? error.message : error);
    rl.close();
    process.exit(1);
  }
};

if (require.main === module) {
  runAdminSeed();
}
