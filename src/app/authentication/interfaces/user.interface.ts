export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: string;
  address: string;
  city: string;
  state: string;
  id?: number;
}
