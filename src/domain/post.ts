export class Post {
  constructor (
      public title: string,
      public content: string,
      public img: string
  ) {}

  public static newPost (
    title: string,
    content: string,
    img: string
  ) : Post {
    return new Post(title, content, img);
  }
}
