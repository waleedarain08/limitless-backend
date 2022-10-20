import { Document } from 'mongoose';
import { IStory } from './story.interface';

export interface IStoryModel extends IStory, Document {}
