const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const assertEmail = (email: string) => {
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

export const assertPassword = (password: string, allowWeak = false) => {
  if (allowWeak) {
    if (password.length < 5) {
      throw new Error('Password too short');
    }
    return;
  }

  if (password.length < 10) {
    throw new Error('Password must be at least 10 characters');
  }
};

export const assertNonEmpty = (value: string, label: string) => {
  if (!value.trim()) {
    throw new Error(`${label} is required`);
  }
};
