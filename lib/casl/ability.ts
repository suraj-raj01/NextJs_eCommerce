import { AbilityBuilder, createMongoAbility, MongoAbility, AbilityClass as CASLAbilityClass } from '@casl/ability';
import { mapPermissionsToCasl } from './mapPermissions';
import { createContext } from 'react';
import { createContextualCan } from '@casl/react';

// Define the shape of a permission and user for type safety
type Permission = {
  action: string;
  subject: string;
};

type Role = {
  permissions: Permission[];
};

type User = {
  role?: Role;
};

// Define your custom ability type
type AppAbilityType = MongoAbility<[string, string]>;

// Create the Ability instance
export const AppAbility = createMongoAbility<[string, string]>();
export const AbilityClass: CASLAbilityClass<[string, string]> = createMongoAbility;

// React context and components
export const AbilityContext = createContext<AppAbilityType>(AppAbility);
export const CanComponent = createContextualCan(AbilityContext.Consumer);

// Define abilities for the given user
export const defineAbilitiesFor = (user?: User): AppAbilityType => {
  const { can, rules } = new AbilityBuilder<AppAbilityType>(AbilityClass);

  console.log('user data', user);

  if (user?.role?.permissions) {
    const permissions = mapPermissionsToCasl(user.role.permissions);

    permissions.forEach(([action, subject]) => {
      can(action, subject);
    });
  }

  return new AbilityClass(rules);
};
