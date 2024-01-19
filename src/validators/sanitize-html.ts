import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export function SanitizeHTML(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sanitizeHtml',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false; // Only sanitize string values
          }

          // Sanitize the input and remove all HTML tags
          const cleanValue = sanitizeHtml(value, {
            allowedTags: [], // Disallow all HTML tags
            allowedAttributes: {}, // Disallow all HTML attributes
          });

          // Update the value of the property to the sanitized value
          args.object[propertyName] = cleanValue;

          return true; // The value is always "valid" after sanitization
        },
      },
    });
  };
}
