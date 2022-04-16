import { registerDecorator, ValidationOptions } from 'class-validator';
import { isMatch } from 'date-fns/fp';

export function IsYYYYMMDD(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function validation(object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsYYYYMMDD',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be a valid YYYY-MM-DD date`,
        ...validationOptions,
      },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(value: any) {
          return isMatch('yyyy-MM-dd', value);
        },
      },
    });
  };
}
