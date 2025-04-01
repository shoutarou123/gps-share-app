export class Post {
  constructor (
      public title: string,
      public content: string,
      public img: string | File | undefined
  ) {}

  public static newPost (
    title: string,
    content: string,
    img: string | File | undefined
  ) : Post {
    return new Post(title, content, img);
  }
}
