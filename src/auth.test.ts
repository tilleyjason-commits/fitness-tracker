import { describe, expect, it } from 'vitest';
import { createAccount, signIn, normalizeUsername } from './auth';
import type { UserAccount } from './types';

const existingAccounts: UserAccount[] = [
  {
    id: 'jason',
    name: 'Jason',
    username: 'jason',
    passwordHash: '3191923f',
    createdAt: '2026-06-03T00:00:00.000Z',
  },
];

describe('auth', () => {
  it('normalizes usernames for consistent sign in', () => {
    expect(normalizeUsername('  Jason.Tilley  ')).toBe('jason.tilley');
  });

  it('creates a new account with normalized credentials', () => {
    const result = createAccount(existingAccounts, {
      name: 'Amanda',
      username: ' Amanda ',
      password: 'password1',
    });

    expect(result.account).toMatchObject({
      id: 'amanda',
      name: 'Amanda',
      username: 'amanda',
    });
    expect(result.account.passwordHash).toBe('a1a6cd8b');
    expect(result.account).not.toHaveProperty('password');
    expect(result.accounts).toHaveLength(2);
  });

  it('does not create duplicate usernames', () => {
    expect(() =>
      createAccount(existingAccounts, {
        name: 'Jason T',
        username: ' JASON ',
        password: 'password1',
      })
    ).toThrow('Username already exists');
  });

  it('requires usable sign up values', () => {
    expect(() => createAccount([], { name: '', username: 'jt', password: 'password1' })).toThrow('Name is required');
    expect(() => createAccount([], { name: 'Jason', username: 'j', password: 'password1' })).toThrow('Username must be at least 3 characters');
    expect(() => createAccount([], { name: 'Jason', username: 'jason', password: 'short' })).toThrow('Password must be at least 6 characters');
  });

  it('signs in with matching normalized username and password', () => {
    expect(signIn(existingAccounts, { username: ' JASON ', password: 'secret123' })).toEqual(existingAccounts[0]);
  });

  it('rejects invalid sign in credentials', () => {
    expect(() => signIn(existingAccounts, { username: 'jason', password: 'wrong' })).toThrow('Invalid username or password');
  });
});
