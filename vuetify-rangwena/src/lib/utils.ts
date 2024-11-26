import * as Joi from "joi";

export function validateForm(
  schema: Joi.ObjectSchema<any>,
  payload: any
): { valid: boolean; errors: Record<string, string> } {
  const { error } = schema.validate(payload, { abortEarly: false });

  let errors: Record<string, string> = {};
  if (error) {
    errors = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {} as Record<string, string>);
  }

  return {
    valid: !!error,
    errors,
  };
}

export function useUUID(): string {
  return `${Date.now()}#${Math.random() * 10000}`;
}

const patterns = [/[a-z]+/, /[A-Z]+/, /[0-9]+/, /[!#@?]+/];

const passwordStrengths = ["", "weak", "fair", "strong", "very strong"];

export function gradePassword(passwd: string): {
  strength: number;
  desc: string;
} {
  const strength = !!passwd
    ? patterns.map((pattern) => !!passwd.match(pattern)).filter((p) => p).length
    : 0;
  return {
    strength,
    desc: passwordStrengths[strength],
  };
}

export function isStrongPassword(passwd: string): boolean {
  return gradePassword(passwd).strength === patterns.length;
}
