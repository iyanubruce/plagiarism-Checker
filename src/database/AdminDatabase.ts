import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const ADMIN_DB_PATH = path.join(__dirname, "../../database/admins.json");

export interface Admin {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
}

export class AdminDatabase {
  private admins: Admin[] = [];

  constructor() {
    this.ensureDatabase();
    this.load();
  }

  private ensureDatabase(): void {
    const dir = path.dirname(ADMIN_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ADMIN_DB_PATH)) {
      fs.writeFileSync(ADMIN_DB_PATH, "[]", "utf-8");
    }
  }

  private load(): void {
    const data = fs.readFileSync(ADMIN_DB_PATH, "utf-8");
    this.admins = JSON.parse(data);
  }

  private save(): void {
    fs.writeFileSync(ADMIN_DB_PATH, JSON.stringify(this.admins, null, 2));
  }

  async createAdmin(
    username: string,
    email: string,
    password: string,
  ): Promise<Admin> {
    const passwordHash = await bcrypt.hash(password, 10);
    const admin: Admin = {
      id: Date.now().toString(),
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.admins.push(admin);
    this.save();
    return admin;
  }

  findByEmail(email: string): Admin | undefined {
    return this.admins.find((a) => a.email === email);
  }

  findById(id: string): Admin | undefined {
    return this.admins.find((a) => a.id === id);
  }
  findByUsername(username: string): Admin | undefined {
    return this.admins.find((a) => a.username === username);
  }
  async validatePassword(admin: Admin, password: string): Promise<boolean> {
    return bcrypt.compare(password, admin.passwordHash);
  }

  updateLastLogin(id: string): void {
    const admin = this.findById(id);
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.save();
    }
  }
}
