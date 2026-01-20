export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export type CustomerCreateDto = {
  name: string;
  phone: string;
  email: string;
  address: string;
}