import db from '../db/connection'

export interface Image {
    id: number;
    image_url: string;
    caption: string;
    created_at: string;
}

export const addImage = async (imageUrl: string, caption: string): Promise<Image> => {
    const [newImage] = await (db('images').insert({ image_url: imageUrl, caption }).returning('*'));
    return newImage;
}

export const getAllImages = async (): Promise<Image[]> => {
    const images = await db('images').select('*').orderBy('created_at', 'desc');
    return images;
}