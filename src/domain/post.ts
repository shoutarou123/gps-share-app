export class Post {
  constructor (
      public id: number,
      public title: string,
      public content: string,
      public image: string
  ) {}

  public static newPost (
    id: number,
    title: string,
    content: string,
    image: string
  ) : Post {
    return new Post(id, title, content, image);
  }
}
