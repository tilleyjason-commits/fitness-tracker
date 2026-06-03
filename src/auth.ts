import type { UserAccount } from './types';

interface SignUpInput {
  name: string;
  username: string;
  password: string;
}

interface SignInInput {
  username: string;
  password: string;
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function makeAccountId(username: string): string {
  return normalizeUsername(username).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function hashPassword(password: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < password.length; index += 1) {
    hash ^= password.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function createAccount(accounts: UserAccount[], input: SignUpInput): { accounts: UserAccount[]; account: UserAccount } {
  const name = input.name.trim();
  const username = normalizeUsername(input.username);
  const password = input.password;

  if (!name) throw new Error('Name is required');
  if (username.length < 3) throw new Error('Username must be at least 3 characters');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (accounts.some(account => account.username === username)) throw new Error('Username already exists');

  const account: UserAccount = {
    id: makeAccountId(username),
    name,
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  return { accounts: [...accounts, account], account };
}

export function signIn(accounts: UserAccount[], input: SignInInput): UserAccount {
  const username = normalizeUsername(input.username);
  const account = accounts.find(candidate => candidate.username === username && candidate.passwordHash === hashPassword(input.password));

  if (!account) throw new Error('Invalid username or password');

  return account;
}
