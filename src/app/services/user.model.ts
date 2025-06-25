export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'auditor' | 'auditee';
  password?: string;
}
