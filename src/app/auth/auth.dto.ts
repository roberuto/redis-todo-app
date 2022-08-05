export interface AuthRegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthLoginDto {
  email: string;
  password: string;
}