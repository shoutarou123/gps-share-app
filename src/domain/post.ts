export class Post {
  constructor (
      public id: number,
      public title: string,
      public content: string | null,
      public image_url: string | null,
      public movie_url: string | null
  ) {}

  public static newPost (
    id: number,
    title: string,
    content: string | null,
    image_url: string | null,
    movie_url: string | null
  ) : Post {
    return new Post(id, title, content, image_url, movie_url);
  }
}
