import { AppDataSource, AppDataSourceTest } from "..";

export const createAppDataSource = async () => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      await AppDataSource.initialize();  
      return;
    }

    await AppDataSourceTest.initialize();
}