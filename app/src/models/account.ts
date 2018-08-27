import { getDotComAPIEndpoint, IAPIEmail } from '../lib/api'

export enum Provider {
  GitHub,
  BitBucket,
}

/**
 * A GitHub account, representing the user found on GitHub The Website or GitHub Enterprise.
 *
 * This contains a token that will be used for operations that require authentication.
 */
export class Account {
  public readonly unlockedKactus: boolean
  public readonly unlockedEnterpriseKactus: boolean
  public readonly unlockedKactusFromOrg: boolean
  public readonly unlockedEnterpriseKactusFromOrg: boolean
  public readonly unlockedKactusFromOrgAdmin: boolean
  public readonly unlockedEnterpriseKactusFromOrgAdmin: boolean

  /** Create an account which can be used to perform unauthenticated API actions */
  public static anonymous(): Account {
    return new Account(
      Provider.GitHub,
      '',
      getDotComAPIEndpoint(),
      '',
      [],
      '',
      -1,
      '',
      null
    )
  }

  public constructor(
    /** The provider (for now only GH or Bitbucket)  */
    public readonly provider: Provider,
    /** The login name for this account  */
    public readonly login: string,
    /** The server for this account - GitHub or a GitHub Enterprise instance */
    public readonly endpoint: string,
    /** The access token used to perform operations on behalf of this account */
    public readonly token: string,
    /** The current list of email addresses associated with the account */
    public readonly emails: ReadonlyArray<IAPIEmail>,
    /** The profile URL to render for this account */
    public readonly avatarURL: string,
    /** The database id for this account */
    public readonly id: number,
    /** The friendly name associated with this account */
    public readonly name: string,
    kactusStatus: {
      /** Wether the user has full access to Kactus */
      premium: boolean
      /** Wether the user has enterprise access to Kactus */
      enterprise: boolean
      enterpriseFromOrg: boolean
      enterpriseFromOrgAdmin: boolean
      premiumFromOrg: boolean
      premiumFromOrgAdmin: boolean
    } | null
  ) {
    this.unlockedKactus = kactusStatus ? !!kactusStatus.premium : false
    this.unlockedEnterpriseKactus = kactusStatus
      ? !!kactusStatus.enterprise
      : false
    this.unlockedKactusFromOrg = kactusStatus
      ? !!kactusStatus.premiumFromOrg
      : false
    this.unlockedEnterpriseKactusFromOrg = kactusStatus
      ? !!kactusStatus.enterpriseFromOrg
      : false
    this.unlockedKactusFromOrgAdmin = kactusStatus
      ? !!kactusStatus.premiumFromOrgAdmin
      : false
    this.unlockedEnterpriseKactusFromOrgAdmin = kactusStatus
      ? !!kactusStatus.enterpriseFromOrgAdmin
      : false
  }

  public withToken(token: string): Account {
    return new Account(
      this.provider,
      this.login,
      this.endpoint,
      token,
      this.emails,
      this.avatarURL,
      this.id,
      this.name,
      {
        premium: this.unlockedKactus,
        enterprise: this.unlockedEnterpriseKactus,
        premiumFromOrg: this.unlockedKactusFromOrg,
        enterpriseFromOrg: this.unlockedEnterpriseKactusFromOrg,
        premiumFromOrgAdmin: this.unlockedKactusFromOrgAdmin,
        enterpriseFromOrgAdmin: this.unlockedEnterpriseKactusFromOrgAdmin,
      }
    )
  }

  public unlockKactus(enterprise: boolean): Account {
    return new Account(
      this.provider,
      this.login,
      this.endpoint,
      this.token,
      this.emails,
      this.avatarURL,
      this.id,
      this.name,
      {
        premium: enterprise
          ? this.unlockedKactusFromOrg
            ? this.unlockedKactus
            : false
          : true,
        enterprise: enterprise
          ? true
          : this.unlockedEnterpriseKactusFromOrg
            ? this.unlockedEnterpriseKactus
            : false,
        premiumFromOrg: this.unlockedKactusFromOrg,
        enterpriseFromOrg: this.unlockedEnterpriseKactusFromOrg,
        premiumFromOrgAdmin: this.unlockedKactusFromOrgAdmin,
        enterpriseFromOrgAdmin: this.unlockedEnterpriseKactusFromOrgAdmin,
      }
    )
  }

  public cancelKactusSubscription(): Account {
    return new Account(
      this.provider,
      this.login,
      this.endpoint,
      this.token,
      this.emails,
      this.avatarURL,
      this.id,
      this.name,
      null
    )
  }
}
