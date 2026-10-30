export type PasswordValidationResult = {
  isValid: boolean;
  missingRequirements: string[];
};

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const missingRequirements: string[] = [];

  if (password.length < 8) {
    missingRequirements.push(
      "At least 8 characters"
    );
  }

  if (!/[A-Z]/.test(password)) {
    missingRequirements.push(
      "At least one uppercase letter"
    );
  }

  if (!/[a-z]/.test(password)) {
    missingRequirements.push(
      "At least one lowercase letter"
    );
  }

  if (!/[0-9]/.test(password)) {
    missingRequirements.push(
      "At least one number"
    );
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    missingRequirements.push(
      "At least one special character"
    );
  }

  return {
    isValid:
      missingRequirements.length === 0,

    missingRequirements,
  };
};