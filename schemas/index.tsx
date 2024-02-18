import { UserRole } from '@prisma/client';
import * as yup from 'yup';

// const roleEnumValues = Object.values(UserRole);

export const settingSchema = yup.object({
  name: yup.string().notRequired(),
  email: yup.string().notRequired().email("Invalid email format"),
  password: yup.string().notRequired(),
  newPassword: yup.string().notRequired(),
  isTwoFactorEnabled: yup.boolean(),
  role: yup.mixed().oneOf([UserRole.ADMIN, UserRole.USER]),
  // role: yup.mixed().oneOf(roleEnumValues).notRequired().nullable(),
})
  // .shape({ role: yup.lazy(value => (yup.string().oneOf(roleEnumValues) as any)) })
  .test("password-or-newPassword", "Both password and newPassword must be provided or both must be absent", (data) => {
  const dataPassword = data.password;
  const dataNewPassword = data.newPassword;
  const bothProvided = dataPassword && dataNewPassword;
  
  if (bothProvided) {
    const passwordTooShort = dataPassword.length < 6;
    const newPasswordTooShort = dataNewPassword.length < 6;
    if (passwordTooShort || newPasswordTooShort) {
      return new yup.ValidationError("Password and newPassword must be at least 6 characters long", data, 'password');
    }
  } else if ((data.password && !data.newPassword) || (!data.password && data.newPassword)) {
    return new yup.ValidationError("Both password and newPassword must be provided or both must be absent", data, 'password');
  }
  return true;
});

export const NewPasswordSchema = yup.object({
  password: yup.string().min(6, 'With 6 characters at least'),
});

export const ResetSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export const LoginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(1, 'Password is required'),
    code: yup.string().notRequired()
  });

export const RegisterSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email required'),
    password: yup.string().min(5, 'Password must be at least 5 characters'),
    name: yup.string().required('Name is required'),
  });
