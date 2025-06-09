import { ApiEndpoint } from './api-endpoints.enum';

export const ApiRoutes = new Map<ApiEndpoint, string>([
  [ApiEndpoint.Login, 'auth/login/'],
  [ApiEndpoint.Logout, 'auth/logout/'],
  [ApiEndpoint.Register, 'auth/register/'],
  [ApiEndpoint.RefreshJWT, 'auth/refresh/'],

  [ApiEndpoint.User, 'users'],

  [ApiEndpoint.Checklist, 'checklist'],

  [ApiEndpoint.Review, 'review'],
  [ApiEndpoint.ReviewResult, 'result'],

  [ApiEndpoint.Dashboard, 'dashboard'],
]);
