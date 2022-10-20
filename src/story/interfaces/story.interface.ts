import { ICategory } from 'src/category/interfaces';

export interface IStory {
  category: ICategory;
  title: String;
  description: String;
  thumbnail: String;
  url: String;
  duration: String;
  views?: Number;
}

export interface IStoryCategories {
  _id: String;
  categoryData: {
    name: String;
    image: String;
  };
  title: String;
  description: String;
  thumbnail: String;
  url: String;
  duration: String;
  views?: Number;
  createdAt: Date;
}
