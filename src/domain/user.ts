export class User {
  constructor (
    public id: string,
    public user_id: number,
    public name: string,
    public unit: string,
    public age: number,
    public address: string,
    public email: string,
  ) {}

  public static newUser (
    id: string,
    user_id: number,
    name: string,
    unit: string,
    age: number,
    address: string,
    email: string,
  ) :User {
    return new User(id, user_id, name, unit, age, address, email);
  }
}
