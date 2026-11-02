export type EmailValidationResult = {
  isValid: boolean;
  message: string;
};

export const validateEmail = (
  email: string
): EmailValidationResult => {
  const cleanedEmail =
    email.trim().toLowerCase();

  if (!cleanedEmail) {
    return {
      isValid: false,
      message:
        "Please enter your email address.",
    };
  }

  if (
    cleanedEmail.includes(" ")
  ) {
    return {
      isValid: false,
      message:
        "Email addresses cannot contain spaces.",
    };
  }

  if (
    cleanedEmail.includes("..")
  ) {
    return {
      isValid: false,
      message:
        "Please enter a valid email address.",
    };
  }

  const emailParts =
    cleanedEmail.split("@");

  if (emailParts.length !== 2) {
    return {
      isValid: false,
      message:
        "Please enter a valid email address.",
    };
  }

  const [localPart, domain] =
    emailParts;

  if (
    !localPart ||
    !domain
  ) {
    return {
      isValid: false,
      message:
        "Please enter a valid email address.",
    };
  }

  const lastDotIndex =
    domain.lastIndexOf(".");

  if (
    lastDotIndex <= 0 ||
    lastDotIndex ===
      domain.length - 1
  ) {
    return {
      isValid: false,
      message:
        "Please enter a complete email address, such as name@example.com.",
    };
  }

  const domainName =
    domain.slice(
      0,
      lastDotIndex
    );

  const extension =
    domain.slice(
      lastDotIndex + 1
    );

  if (
    !/[a-z]/i.test(domainName)
  ) {
    return {
      isValid: false,
      message:
        "Please enter an email address with a valid domain name.",
    };
  }

  if (
    !/^[a-z]{2,}$/i.test(
      extension
    )
  ) {
    return {
      isValid: false,
      message:
        "Please enter an email address with a valid extension.",
    };
  }

  const emailPattern =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

  if (
    !emailPattern.test(
      cleanedEmail
    )
  ) {
    return {
      isValid: false,
      message:
        "Please enter a valid email address.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};