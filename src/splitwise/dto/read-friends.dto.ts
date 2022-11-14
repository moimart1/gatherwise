export interface ReadFriends {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  picture: Picture;
  groups: Group[];
  balance: Balance2[];
  updated_at: string;
}

interface Picture {
  small: string;
  medium: string;
  large: string;
}

interface Group {
  group_id: number;
  balance: Balance[];
}

interface Balance {
  currency_code: string;
  amount: string;
}

interface Balance2 {
  currency_code: string;
  amount: string;
}
