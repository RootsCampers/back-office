import {
  AuthSession,
  SignUpLoginRequest,
  SignInWithOAuthRequest,
} from "@/modules/auth/domain";

export interface IAuthService {
  /**
   * Signs up a new user
   *
   * @param request - Sign up request with email and password
   * @returns Promise<AuthSession> - Validated auth session with tokens and user data
   */
  signUp(request: SignUpLoginRequest): Promise<AuthSession>;

  /**
   * Signs in with email and password
   *
   * @param request - Sign in request with email and password
   * @returns Promise<AuthSession> - Validated auth session with tokens and user data
   */
  signInWithPassword(request: SignUpLoginRequest): Promise<AuthSession>;

  /**
   * Initiates OAuth sign in/sign up flow
   *
   * Note: This redirects the user to the OAuth provider.
   * The session is obtained after the OAuth callback.
   *
   * @param request - OAuth request with provider and redirect URL
   * @returns Promise<void> - Redirects user to OAuth provider
   */
  signInWithOAuth(request: SignInWithOAuthRequest): Promise<void>;

  /**
   * Refreshes the access token using refresh token
   *
   * @param refreshToken - The refresh token to use
   * @returns Promise<AuthSession> - Validated auth session with new tokens and user data
   */
  refreshToken(refreshToken: string): Promise<AuthSession>;

  /**
   * Logs out the user
   *
   * @param accessToken - The access token to authenticate the request
   * @returns Promise<void> - Logs out the user
   */
  logout(accessToken: string): Promise<void>;
}
