import { type User, type InsertUser } from "@shared/schema"; // Step 1: User & InsertUser import

export interface IStorage { // Step 2: Update IStorage interface
  getUser(id: number): Promise<User | undefined>;
  // getUserByUsername(username: string): Promise<User | undefined>; // Removed
  // createUser(user: InsertUser): Promise<User>; // Removed

  getUserByGoogleId(googleId: string): Promise<User | undefined>; // Added
  findOrCreateUserByGoogleId(profile: {
    googleId: string;
    email: string;
    displayName: string;
    avatarUrl?: string | null; // Matches provided snippet
  }): Promise<User>; // Added
}

export class MemStorage implements IStorage { // Step 3: Update MemStorage class
  private users: Map<number, User>; // Ensure User type is updated (implicitly by import)
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1; // currentId initialization
  }

  async getUser(id: number): Promise<User | undefined> { // Ensure return type is updated User
    return this.users.get(id);
  }

  // getUserByUsername method removed

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
  for (const user of Array.from(this.users.values())) {
    if (user.googleId === googleId) {
      return user;
    }
  }
  return undefined;
}


  async findOrCreateUserByGoogleId(profile: { // Implemented
    googleId: string;
    email: string;
    displayName: string;
    avatarUrl?: string | null;
  }): Promise<User> {
    const existingUserByGoogleId = await this.getUserByGoogleId(profile.googleId);
    if (existingUserByGoogleId) {
      // Optional: Update user details if they changed in Google profile
      // For MemStorage, let's update if values are different to simulate this
      let updated = false;
      if (existingUserByGoogleId.displayName !== profile.displayName) {
        existingUserByGoogleId.displayName = profile.displayName;
        updated = true;
      }
      if (existingUserByGoogleId.avatarUrl !== (profile.avatarUrl || null)) {
        existingUserByGoogleId.avatarUrl = profile.avatarUrl || null;
        updated = true;
      }
      if (existingUserByGoogleId.email !== profile.email) { // Usually stable
        existingUserByGoogleId.email = profile.email;
        updated = true;
      }
      if (updated) {
        this.users.set(existingUserByGoogleId.id, existingUserByGoogleId);
      }
      return existingUserByGoogleId;
    }

    // Optional: Check if a user with this email already exists...
    // For now, creating a new user if no direct googleId match.

    const newId = this.currentId++;
    const newUser: User = {
      id: newId,
      googleId: profile.googleId,
      email: profile.email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl || null,
      createdAt: new Date(), // createdAt as Date object
      // Ensure all fields from the User type in shared/schema.ts are covered
      // If 'username' was made nullable and still exists in User type:
      // username: null, 
    };
    this.users.set(newId, newUser);
    return newUser;
  }

  // createUser method removed
}

export const storage = new MemStorage();
