import { v4 as uuidv4 } from "uuid";
import type { User } from "../domain/models/user";

export class UserService {
  private readonly mockUsers: User[] = [
    {
      id: uuidv4(),
      username: "johndoe",
      email: "john.doe@example.com",
      fullName: "John Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=johndoe",
      createdDate: new Date(),
      updatedDate: new Date(),
    },
    {
      id: uuidv4(),
      username: "janedoe",
      email: "jane.doe@example.com",
      fullName: "Jane Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=janedoe",
      createdDate: new Date(),
      updatedDate: new Date(),
    },
  ];

  private currentUser: User | null = null;

  async getAll(): Promise<User[]> {
    return Promise.resolve(this.mockUsers);
  }

  async getById(id: string): Promise<User | undefined> {
    const user = this.mockUsers.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  async create(
    user: Omit<User, "id" | "createdDate" | "updatedDate">
  ): Promise<User> {
    const newUser: User = {
      ...user,
      id: uuidv4(), // Generate random GUID as ID
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    this.mockUsers.push(newUser);
    return Promise.resolve(newUser);
  }

  async update(user: User): Promise<User> {
    const index = this.mockUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      const updatedUser = {
        ...user,
        updatedDate: new Date(),
      };
      this.mockUsers[index] = updatedUser;
      return Promise.resolve(updatedUser);
    }
    throw new Error("User not found");
  }

  async delete(id: string): Promise<void> {
    const index = this.mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return Promise.resolve();
    }
    throw new Error("User not found");
  }

  // Generate a new random user ID (GUID)
  generateUserId(): string {
    return uuidv4();
  }

  // Register a new user
  async register(userData: {
    username: string;
    email: string;
    fullName: string;
    password: string; // In a real app, you'd hash this
    avatarUrl?: string;
  }): Promise<User> {
    // Check if username or email already exists
    const existingUser = this.mockUsers.find(
      (user) =>
        user.username === userData.username || user.email === userData.email
    );

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    // Create new user (omitting password from the stored user object)
    const { password, ...userWithoutPassword } = userData;
    const newUser = await this.create(userWithoutPassword);

    // Auto login the user
    this.currentUser = newUser;
    localStorage.setItem("user_token", uuidv4());
    localStorage.setItem("user_id", newUser.id);

    return newUser;
  }

  // Login method
  async login(username: string, password: string): Promise<User> {
    // In a mock service, we'll just find a user by username and assume password is correct
    const user = this.mockUsers.find((user) => user.username === username);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Set as current user
    this.currentUser = user;

    // Simulate storing token in localStorage
    localStorage.setItem("user_token", uuidv4());
    localStorage.setItem("user_id", user.id);

    return Promise.resolve(user);
  }

  // Logout method
  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
    return Promise.resolve();
  }

  // Get current logged-in user
  async getCurrentUser(): Promise<User | null> {
    // If we already have the current user in memory, return it
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }

    // Otherwise, try to get user from localStorage
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      return Promise.resolve(null);
    }

    // Find user by ID
    const user = this.mockUsers.find((user) => user.id === userId);
    if (user) {
      this.currentUser = user;
    }

    return Promise.resolve(user || null);
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}
