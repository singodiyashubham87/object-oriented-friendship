import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import db from "./db/index.js";
import { Request, User } from "./db/schema/index.js";
import { REQUEST_STATUS } from "./enums/requestStatus.js";

const seedRequest = async () => {
  try {
    const allUsers = await db.select().from(User).limit(15);

    const userIds = allUsers
      .map((user) => user.id)
      .filter((id) => id !== "f7448ada-3425-4747-9789-4ea7bce6da6b");

    for (const userId of userIds) {
      await db
        .insert(Request)
        .values({
          senderId: userId,
          receiverId: "f7448ada-3425-4747-9789-4ea7bce6da6b",
          status: REQUEST_STATUS.PENDING,
          createdAt: dayjs().toDate(),
          updatedAt: dayjs().toDate(),
        })
        .onConflictDoNothing()
        .returning();
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const seedUser = async () => {
  // Add seeding script for User table to get all the users & then insert random age, location, & gender. Location should be a state of india & gender can be only M or F.
  try {
    const allUsers = await db.select().from(User);

    for (const user of allUsers) {
      const randomAge = Math.floor(Math.random() * 50) + 18; // Random age between 18 and 77
      const randomLocation =
        INDIAN_STATES[Math.floor(Math.random() * INDIAN_STATES.length)]; // Random state from the list
      const randomGender = Math.random() > 0.5 ? "M" : "F"; // Random
      const updatedUser = await db
        .update(User)
        .set({
          // age: randomAge,
          location: randomLocation,
          // gender: randomGender,
          updatedAt: dayjs().toDate(),
        })
        .where(eq(User.id, user.id))
        .returning();

      console.log("🚀 ~ seedUser ~ updatedUser:", updatedUser);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

const seedUserProfile = async () => {
  try {
    // Fetch all users from the User table
    const allUsers = await db.select().from(User);

    // Fetch avatar URLs from RandomUser.me
    // const response = await fetch(
    //   `https://randomuser.me/api/?results=${allUsers.length}&inc=picture,gender`,
    // );
    // const data = await response.json();
    // const avatars = data.results.map((result) => ({
    //   url: result.picture.large,
    //   gender: result.gender, // 'male' or 'female'
    // }));

    // Update each user with a matching avatar URL
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];

      const avatarUrl =
        user.gender === "M"
          ? `https://randomuser.me/api/portraits/men/${i}.jpg`
          : `https://randomuser.me/api/portraits/women/${i}.jpg`;

      const updatedUser = await db
        .update(User)
        .set({
          avatar: avatarUrl,
          updatedAt: dayjs().toDate(),
        })
        .where(eq(User.id, user.id))
        .returning();

      console.log("🚀 ~ seedUserProfile ~ updatedUser:", updatedUser);
    }

    console.log("User profiles seeded with avatar URLs successfully");
  } catch (error) {
    console.error("Error seeding user profiles:", error);
  }
};

// Execute seeding functions
Promise.all([seedUserProfile()]).then(() => {
  console.log("All seeding completed");
});
