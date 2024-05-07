import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function JustDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: 'Please provide date like: YYYY-MM-DD',
        ...validationOptions,
      },
      constraints: [property],
      validator: JustDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'JustDate' })
export class JustDateConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(relatedValue);
  }
}
