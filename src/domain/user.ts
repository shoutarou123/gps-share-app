export class User {
  constructor (
    public id: number,
    public name: string,
    public unit: string,
    public age: number,
    public adress: string,
    public email: string,
    public image?: HTMLImageElement 
  ) {}

  public static newUser(
    id: number,
    name: string,
    unit: string,
    age: number,
    adress: string,
    email: string,
    image?: HTMLImageElement
  ) :User {
    return new User(id, name, unit, age, adress, email, image);
  }
}