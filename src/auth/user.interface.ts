export enum UserModelEnum {
  member = 'member',
  device = 'device',
}

/**
 * Represents a User (JWT data), to complete...
 */
export interface IUser {
  /**
   * Expiration unix epoch time
   */
  exp?: number;

  /**
   * Issuer (Realm URL in Keycloak)
   */
  iss?: string;

  /**
   * Subject (User ID in Keycloak)
   */
  sub?: string;

  /**
   * Model associated to the user
   */
  model?: UserModelEnum;

  /**
   * Email of the user
   */
  email?: string;

  /**
   * Firstname of the user
   */
  given_name?: string;

  /**
   * Lastname of the user
   */
  family_name?: string;

  /**
   * Associated groups
   */
  groups?: string[];
}
