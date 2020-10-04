import { ValidationError } from 'yup';

interface Error {
  [key: string]: string;
}

const getValidationErrors = (errors: ValidationError): Error => {
  const caughtErrors: Error = {};

  errors.inner.forEach(error => {
    caughtErrors[error.path] = error.message;
  });

  return caughtErrors;
};

export default getValidationErrors;
