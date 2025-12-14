export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CustomerCreateDto {
  name: string;
  phone: string;
  email: string;
  address: string;
}