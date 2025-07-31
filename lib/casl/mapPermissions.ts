type PermissionKey =
  | 'manageadmins'
  | 'manageroles'
  | 'managepermissions'
  | 'managevendors'
  | 'updateproducts'
  | 'createproducts'
  | 'viewproducts'
  | 'manageuser';

type Action = 'manage' | 'update' | 'create' | 'read';
type Subject = 'Admin' | 'Roles' | 'Permissions' | 'Vendor' | 'Products' | 'User';

type CaslPermissionTuple = [Action, Subject];

export const mapPermissionsToCasl = (
  permissions: PermissionKey[]
): CaslPermissionTuple[] => {
  const mapped: CaslPermissionTuple[] = [];

  const permissionMap: Record<PermissionKey, CaslPermissionTuple> = {
    manageadmins: ['manage', 'Admin'],
    manageroles: ['manage', 'Roles'],
    managepermissions: ['manage', 'Permissions'],
    managevendors: ['manage', 'Vendor'],
    updateproducts: ['update', 'Products'],
    createproducts: ['create', 'Products'],
    viewproducts: ['read', 'Products'],
    manageuser: ['manage', 'User'],
  };

  permissions.forEach((perm) => {
    const mapping = permissionMap[perm];
    if (mapping) {
      mapped.push(mapping);
    }
  });

  return mapped;
};
